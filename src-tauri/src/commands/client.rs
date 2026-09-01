use rusqlite::params;
use tauri::AppHandle;

use crate::{
    database::connection,
    models::client_details::{
        ClientDetails,
        ClientEvent,
        ClientEventService,
        ClientInfo,
        ClientListItem,
    },
};

fn overall_status_for_services(services: &[ClientEventService]) -> String {
    if services.is_empty() {
        return "Pending".to_string();
    }

    if services.iter().all(|s| s.status == "Completed") {
        "Completed".to_string()
    } else {
        "Pending".to_string()
    }
}

#[tauri::command]
pub fn get_clients(
    app: AppHandle,
) -> Result<Vec<ClientListItem>, String> {
    let conn = connection::get_connection(&app);

    let mut stmt = conn
        .prepare(
            "
            SELECT
                clients.id,
                clients.name,
                IFNULL(clients.phone, ''),
                IFNULL(clients.email, ''),
                (
                    SELECT COUNT(*)
                    FROM quotations
                    WHERE quotations.client_id = clients.id
                ) AS event_count
            FROM clients
            ORDER BY clients.name COLLATE NOCASE ASC
            ",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            Ok(ClientListItem {
                id: row.get(0)?,
                name: row.get(1)?,
                phone: row.get(2)?,
                email: row.get(3)?,
                event_count: row.get(4)?,
                overall_status: "Pending".to_string(),
            })
        })
        .map_err(|e| e.to_string())?;

    let mut clients = Vec::new();

    for row in rows {
        let mut client = row.map_err(|e| e.to_string())?;

        client.overall_status = get_client_overall_status(&conn, client.id);

        clients.push(client);
    }

    Ok(clients)
}

fn get_client_overall_status(conn: &rusqlite::Connection, client_id: i64) -> String {
    let query = "
        SELECT COUNT(*)
        FROM quotation_services
        WHERE quotation_id IN (
            SELECT id FROM quotations WHERE client_id = ?1
        )
        AND status <> 'Completed'
    ";

    let pending: i64 = conn
        .query_row(query, [client_id], |row| row.get(0))
        .unwrap_or(0);

    if pending == 0 {
        "Completed".to_string()
    } else {
        "Pending".to_string()
    }
}

#[tauri::command]
pub fn get_client_details(
    id: i64,
    app: AppHandle,
) -> Result<ClientDetails, String> {
    let conn = connection::get_connection(&app);

    // ---------------------------
    // Load client
    // ---------------------------

    let client = conn
        .query_row(
            "
            SELECT id, name, IFNULL(phone,''), IFNULL(email,''), IFNULL(address,'')
            FROM clients
            WHERE id = ?1
            ",
            [id],
            |row| {
                Ok(ClientInfo {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    phone: row.get(2)?,
                    email: row.get(3)?,
                    address: row.get(4)?,
                })
            },
        )
        .map_err(|e| e.to_string())?;

    // ---------------------------
    // Load quotations (events) for this client
    // ---------------------------

    let mut stmt = conn
        .prepare(
            "
            SELECT
                id,
                quotation_number,
                IFNULL(event_type, ''),
                IFNULL(event_date, ''),
                IFNULL(event_time, ''),
                IFNULL(venue, ''),
                IFNULL(city, '')
            FROM quotations
            WHERE client_id = ?1
            ORDER BY id DESC
            ",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([id], |row| {
            Ok(ClientEvent {
                quotation_id: row.get(0)?,
                quotation_number: row.get(1)?,
                event_type: row.get(2)?,
                event_date: row.get(3)?,
                event_time: row.get(4)?,
                venue: row.get(5)?,
                city: row.get(6)?,
                services: Vec::new(),
                overall_status: "Pending".to_string(),
            })
        })
        .map_err(|e| e.to_string())?;

    let mut events = Vec::new();

    for row in rows {
        let mut event = row.map_err(|e| e.to_string())?;

        // ---------------------------
        // Load services for the event
        // ---------------------------

        let mut service_stmt = conn
            .prepare(
                "
                SELECT
                    id,
                    service_name,
                    quantity,
                    price,
                    total,
                    status
                FROM quotation_services
                WHERE quotation_id = ?1
                ORDER BY id ASC
                ",
            )
            .map_err(|e| e.to_string())?;

        let service_rows = service_stmt
            .query_map([event.quotation_id], |row| {
                Ok(ClientEventService {
                    id: row.get(0)?,
                    service_name: row.get(1)?,
                    quantity: row.get(2)?,
                    price: row.get(3)?,
                    total: row.get(4)?,
                    status: row.get(5)?,
                })
            })
            .map_err(|e| e.to_string())?;

        let mut services = Vec::new();

        for service in service_rows {
            services.push(service.map_err(|e| e.to_string())?);
        }

        event.services = services;
        event.overall_status = overall_status_for_services(&event.services);

        events.push(event);
    }

    let overall_status = {
        let all_completed = !events.is_empty()
            && events.iter().all(|e| e.overall_status == "Completed");

        if all_completed {
            "Completed".to_string()
        } else {
            "Pending".to_string()
        }
    };

    Ok(ClientDetails {
        client,
        events,
        overall_status,
    })
}

#[tauri::command]
pub fn update_service_status(
    service_id: i64,
    status: String,
    app: AppHandle,
) -> Result<(), String> {
    let conn = connection::get_connection(&app);

    if status != "Completed" && status != "Pending" {
        return Err("Invalid status. Must be 'Completed' or 'Pending'.".to_string());
    }

    conn.execute(
        "
        UPDATE quotation_services
        SET status = ?1
        WHERE id = ?2
        ",
        params![status, service_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}
