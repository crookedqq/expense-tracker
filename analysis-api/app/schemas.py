import datetime as dt

from pydantic import BaseModel, Field


class ExpenseIn(BaseModel):
    id: str
    expName: str = ""
    amount: float = Field(gt=0)
    date: dt.date
    category: str = "Other"