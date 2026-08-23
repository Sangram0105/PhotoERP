use rusqlite::{params, Result};

use tauri::AppHandle;

use crate::{
    database::connection,
    models::client::Client,
    models::quotation::{Quotation, ServiceItem},
    models::quotation_list::QuotationListItem,
};

#[tauri::command]
pub fn save_quotation(
    app: AppHandle,
    quotation: Quotation,
) -> Result<String, String> {

    let mut conn = connection::get_connection(&app);

    let tx = conn
        .transaction()
        .map_err(|e| e.to_string())?;

    tx.execute(
        "
        INSERT INTO clients
        (
            name,
            phone,
            email,
            address
        )
        VALUES (?1, ?2, ?3, ?4)
        ",
        params![
            quotation.client.name,
            quotation.client.phone,
            quotation.client.email,
            quotation.client.address
        ],
    )
    .map_err(|e| e.to_string())?;


    let client_id = tx.last_insert_rowid();


    tx.execute(
        "
        INSERT INTO quotations
        (
            quotation_number,
            client_id,
            event_type,
            event_date,
            event_time,
            venue,
            city,
            subtotal,
            discount,
            advance_amount,
            total,
            balance,
            notes
        )
        VALUES
        (
            ?1,?2,?3,?4,?5,
            ?6,?7,?8,?9,?10,
            ?11,?12,?13
        )
        ",
        params![
            quotation.quotation_number,
            client_id,
            quotation.event_type,
            quotation.event_date,
            quotation.event_time,
            quotation.venue,
            quotation.city,
            quotation.subtotal,
            quotation.discount,
            quotation.advance_amount,
            quotation.total,
            quotation.balance,
            quotation.notes
        ],
    )
    .map_err(|e| e.to_string())?;


    let quotation_id = tx.last_insert_rowid();


    for service in quotation.services {

        tx.execute(
            "
            INSERT INTO quotation_services
            (
                quotation_id,
                service_name,
                quantity,
                price,
                total
            )
            VALUES (?1,?2,?3,?4,?5)
            ",
            params![
                quotation_id,
                service.service_name,
                service.quantity,
                service.price,
                service.total
            ],
        )
        .map_err(|e| e.to_string())?;
    }


    tx.commit()
        .map_err(|e| e.to_string())?;


    Ok("Quotation Saved Successfully".to_string())
}




#[tauri::command]
pub fn get_quotations(
    app: AppHandle,
) -> Result<Vec<QuotationListItem>, String> {


    let conn = connection::get_connection(&app);


    let mut stmt = conn.prepare(
        "
        SELECT
            quotations.id,
            quotations.quotation_number,
            clients.name,
            quotations.event_type,
            quotations.event_date,
            quotations.total,
            quotations.balance,
            CASE
    WHEN quotations.balance = 0 THEN 'Paid'
    WHEN quotations.balance = quotations.total THEN 'Pending'
    ELSE 'Partial'
           END AS status

        FROM quotations

        INNER JOIN clients
        ON quotations.client_id = clients.id

        ORDER BY quotations.id DESC
        "
    )
    .map_err(|e| e.to_string())?;


    let rows = stmt.query_map([], |row| {

        Ok(QuotationListItem {

            id: row.get(0)?,

            quotation_number: row.get(1)?,

            client_name: row.get(2)?,

            event_type: row.get(3)?,

            event_date: row.get(4)?,

            total: row.get(5)?,

            balance: row.get(6)?,

            status: row.get(7)?,
        })

    })
    .map_err(|e| e.to_string())?;


    let mut quotations = Vec::new();


    for item in rows {

        quotations.push(
            item.map_err(|e| e.to_string())?
        );

    }


    Ok(quotations)
}





#[tauri::command]
pub fn delete_quotation(
    id: i64,
    app: AppHandle,
) -> Result<(), String> {

    let mut conn = connection::get_connection(&app);


    let tx = conn
        .transaction()
        .map_err(|e| e.to_string())?;


    // Delete quotation services first
    tx.execute(
        "
        DELETE FROM quotation_services
        WHERE quotation_id = ?1
        ",
        [id],
    )
    .map_err(|e| e.to_string())?;


    // Delete quotation
    tx.execute(
        "
        DELETE FROM quotations
        WHERE id = ?1
        ",
        [id],
    )
    .map_err(|e| e.to_string())?;


    tx.commit()
        .map_err(|e| e.to_string())?;


    Ok(())
}



#[tauri::command]
pub fn get_quotation_by_id(
    id: i64,
    app: tauri::AppHandle,
) -> Result<Quotation, String> {

   let conn = crate::database::connection::get_connection(&app);

    // ---------------------------
    // Load quotation
    // ---------------------------

    let mut stmt = conn.prepare(
    "
    SELECT
        quotations.quotation_number,

        clients.name,
        clients.phone,
        clients.email,
        clients.address,

        quotations.event_type,
        quotations.event_date,
        quotations.event_time,

        quotations.venue,
        quotations.city,

        quotations.subtotal,
        quotations.discount,
        quotations.advance_amount,
        quotations.total,
        quotations.balance,

        quotations.notes

    FROM quotations

    INNER JOIN clients
        ON quotations.client_id = clients.id

    WHERE quotations.id = ?1
    ",
)
.map_err(|e| e.to_string())?;

    let mut quotation = stmt.query_row([id], |row| {

        Ok(Quotation {

            id: Some(id),

            quotation_number: row.get(0)?,

            client: Client {

                name: row.get(1)?,

                phone: row.get(2)?,

                email: row.get(3)?,

                address: row.get(4)?,
            },

            event_type: row.get(5)?,

            event_date: row.get(6)?,

            event_time: row.get(7)?,

            venue: row.get(8)?,

            city: row.get(9)?,

            subtotal: row.get(10)?,

            discount: row.get(11)?,

            advance_amount: row.get(12)?,

            total: row.get(13)?,

            balance: row.get(14)?,

            notes: row.get(15)?,

            services: Vec::new(),
        })

    }).map_err(|e| e.to_string())?;

    // ---------------------------
    // Load services
    // ---------------------------

    let mut stmt = conn.prepare(
        "
        SELECT
            service_name,
            quantity,
            price,
            total

        FROM quotation_services

        WHERE quotation_id=?1
        ",
    ).map_err(|e| e.to_string())?;

    let rows = stmt.query_map([id], |row| {

        Ok(ServiceItem {

            service_name: row.get(0)?,

            quantity: row.get(1)?,

            price: row.get(2)?,

            total: row.get(3)?,
        })

    }).map_err(|e| e.to_string())?;

    let mut services = Vec::new();

    for item in rows {

        services.push(item.map_err(|e| e.to_string())?);

    }

    quotation.services = services;

    Ok(quotation)
}




#[tauri::command]
pub fn update_quotation(
    app: AppHandle,
    quotation: Quotation,
) -> Result<String, String> {

    let mut conn = connection::get_connection(&app);

    let tx = conn.transaction()
        .map_err(|e| e.to_string())?;

    let quotation_id = quotation
        .id
        .ok_or("Quotation id is missing")?;

   tx.execute(
    "
    UPDATE clients
    SET
        name = ?1,
        phone = ?2,
        email = ?3,
        address = ?4
    WHERE id = (
        SELECT client_id
        FROM quotations
        WHERE id = ?5
    )
    ",
    params![
        quotation.client.name,
        quotation.client.phone,
        quotation.client.email,
        quotation.client.address,
        quotation_id,
    ],
)
.map_err(|e| e.to_string())?;


    tx.execute(
    "
    UPDATE quotations
    SET
        quotation_number = ?1,

        event_type = ?2,
        event_date = ?3,
        event_time = ?4,

        venue = ?5,
        city = ?6,

        subtotal = ?7,
        discount = ?8,
        advance_amount = ?9,
        total = ?10,
        balance = ?11,

        notes = ?12

    WHERE id = ?13
    ",
    params![
        quotation.quotation_number,

        quotation.event_type,
        quotation.event_date,
        quotation.event_time,

        quotation.venue,
        quotation.city,

        quotation.subtotal,
        quotation.discount,
        quotation.advance_amount,
        quotation.total,
        quotation.balance,

        quotation.notes,

        quotation_id,
    ],
)
.map_err(|e| e.to_string())?;

     tx.execute(
    "
    DELETE FROM quotation_services
    WHERE quotation_id = ?1
    ",
    [quotation_id],
)
.map_err(|e| e.to_string())?;


     for service in quotation.services {

    tx.execute(
        "
        INSERT INTO quotation_services
        (
            quotation_id,
            service_name,
            quantity,
            price,
            total
        )
        VALUES (?1, ?2, ?3, ?4, ?5)
        ",
        params![
            quotation_id,
            service.service_name,
            service.quantity,
            service.price,
            service.total,
        ],
    )
    .map_err(|e| e.to_string())?;
}


      tx.commit()
    .map_err(|e| e.to_string())?;

Ok("Quotation Updated Successfully".to_string())





}


