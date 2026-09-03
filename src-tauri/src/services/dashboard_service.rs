use rusqlite::Result;

use crate::{
    database::connection,
    models::{
        dashboard::DashboardStats,
        quotation_list::QuotationListItem,
    },
};

pub fn get_dashboard_stats(
    app: tauri::AppHandle,
) -> Result<DashboardStats, String> {

    let conn = connection::get_connection(&app);

    // -----------------------------------
    // Total Quotations
    // -----------------------------------

    let total_quotations: i64 = conn
        .query_row(
            "SELECT COUNT(*) FROM quotations",
            [],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    // -----------------------------------
    // Revenue
    // Revenue = SUM(all payments)
    // -----------------------------------

    let total_revenue: f64 = conn
        .query_row(
            "SELECT IFNULL(SUM(amount), 0) FROM payments",
            [],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    // -----------------------------------
    // Pending Balance
    // Pending = SUM(quotation.total - paid_amount)
    // -----------------------------------

    let pending_balance: f64 = conn
        .query_row(
            "
            SELECT IFNULL(
                SUM(quotations.total - IFNULL(paid_totals.paid, 0)),
                0
            )
            FROM quotations
            LEFT JOIN (
                SELECT quotation_id, SUM(amount) AS paid
                FROM payments
                GROUP BY quotation_id
            ) AS paid_totals
            ON paid_totals.quotation_id = quotations.id
            ",
            [],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    // -----------------------------------
    // Upcoming Events
    // -----------------------------------

    let upcoming_events: i64 = conn
        .query_row(
            "
            SELECT COUNT(*)
            FROM quotations
            WHERE date(event_date) >= date('now')
            ",
            [],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    // -----------------------------------
    // Recent Quotations
    // -----------------------------------

    let mut stmt = conn
        .prepare(
            "
            SELECT
                quotations.id,
                quotations.quotation_number,
                clients.name,
                quotations.event_type,
                quotations.event_date,
                quotations.total,
                quotations.balance,
                quotations.status
            FROM quotations

            INNER JOIN clients
                ON quotations.client_id = clients.id

            ORDER BY quotations.id DESC

            LIMIT 5
            ",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
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

    let mut recent_quotations = Vec::new();

    for row in rows {
        recent_quotations.push(
            row.map_err(|e| e.to_string())?,
        );
    }




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
        quotations.status

    FROM quotations

    INNER JOIN clients
        ON quotations.client_id = clients.id

    WHERE date(quotations.event_date) >= date('now')

    ORDER BY quotations.event_date ASC

    LIMIT 5
    ",
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

let mut upcoming_event_list = Vec::new();

for item in rows {
    upcoming_event_list.push(
        item.map_err(|e| e.to_string())?
    );
}

    Ok(DashboardStats {
        total_quotations,
        total_revenue,
        pending_balance,
        upcoming_events,
        recent_quotations,

        upcoming_event_list,
    })
}