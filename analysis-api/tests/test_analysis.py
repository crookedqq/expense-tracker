import datetime as dt

from app import analysis
from app.schemas import ExpenseIn


def make(amount, day, category="Food"):
    return ExpenseIn(
        id=f"{day}-{amount}", amount=amount,
        date=dt.date.fromisoformat(day), category=category,
    )


def test_monthly_summary_fills_gap_months():
    df = analysis.to_frame([make(10, "2026-08-05"), make(30, "2026-10-05")])
    months = analysis.monthly_summary(df)
    assert [m["month"] for m in months] == ["2026-08", "2026-09", "2026-10"]
    assert months[1]["total_cents"] == 0


def test_money_is_integer_cents():
    df = analysis.to_frame([make(0.1, "2026-10-01"), make(0.2, "2026-10-02")])
    assert analysis.monthly_summary(df)[0]["total_cents"] == 30


def test_category_shares_add_up():
    df = analysis.to_frame([make(30, "2026-10-01", "Food"), make(10, "2026-10-02", "Bills")])
    shares = {c["category"]: c["share_pct"] for c in analysis.category_breakdown(df)}
    assert shares == {"Food": 75.0, "Bills": 25.0}


def test_anomaly_flags_the_outlier():
    normal = [make(10 + i % 3, f"2026-10-{i + 1:02d}") for i in range(8)]
    df = analysis.to_frame(normal + [make(200, "2026-10-20")])
    assert [a["amount_cents"] for a in analysis.anomalies(df)] == [20000]


def test_no_anomalies_without_enough_history():
    df = analysis.to_frame([make(10, "2026-10-01"), make(500, "2026-10-02")])
    assert analysis.anomalies(df) == []


def test_empty_input_is_safe():
    df = analysis.to_frame([])
    assert analysis.monthly_summary(df) == []
    assert analysis.category_breakdown(df) == []
    assert analysis.anomalies(df) == []