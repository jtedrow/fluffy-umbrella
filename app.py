from flask import Flask, render_template, jsonify
import pandas as pd
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask_sqlalchemy import SQLAlchemy
import numpy as np

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/data.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

mos = Base.classes.mosquito_data
stmt = db.session.query(mos).statement
df = pd.read_sql_query(stmt, db.session.bind)
df = df.drop(["LOCATION", "Census Tracts",
              "Historical Wards 2003-2015", "ID"], 1)


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/names/")
def names():
    # Return a list of column names
    new_df = df[["SEASON YEAR", "BLOCK",
                 'TRAP_TYPE', 'SPECIES', 'Wards', 'Zip Codes']]

    column_sum = []

    for c in new_df.columns:
        dictionary = {
            f"{c}": list(set(new_df[c]))
        }
        column_sum.append(dictionary)

    return jsonify(column_sum)


@app.route("/positives/")
def postives():
    # Return a dictionary of only positive results

    pos_df = df[df.RESULT == "positive"].reset_index()
    pos_dict = pos_df.to_dict("records")

    return jsonify(pos_dict)


@app.route("/year/<year>")
def postives_year(year):
    # Return a dictionary of only positive results
    year = int(year)
    year_df = df[df["SEASON YEAR"] == year].reset_index()
    year_dict = year_df.to_dict("records")

    return jsonify(year_dict)


@app.route("/ward/<ward>")
def postives_ward(ward):
    # Return a dictionary of only positive results
    ward = int(ward)
    ward_df = df[df["Wards"] == ward].reset_index()
    ward_dict = ward_df.to_dict("records")

    return jsonify(ward_dict)


@app.route("/summary/")
def summary():
    meta = df.groupby(["SEASON YEAR", "RESULT"]).count().reset_index()
    year = list(meta[meta.RESULT == "negative"]["SEASON YEAR"])
    neg = list(meta[meta.RESULT == "negative"]["BLOCK"])
    pos = list(meta[meta.RESULT == "positive"]["BLOCK"])

    diction = []

    for i in range(len(year)):
        d = {
            "Year": year[i],
            "Pos": pos[i],
            "Neg": neg[i]
        }

        diction.append(d)

    # df_dict = new_df.to_dict(orient="index")
    return jsonify(diction)


@app.route("/summary/byweek/")
def by_week():
    df['Positive'] = np.where(df['RESULT'] == 'positive', 1, 0)
    df['Negative'] = np.where(df['RESULT'] == 'negative', 1, 0)

    pos = df.groupby(["SEASON YEAR", "WEEK", "SPECIES"]).sum()["Positive"]
    neg = df.groupby(["SEASON YEAR", "WEEK", "SPECIES"]).sum()["Negative"]
    count = df.groupby(["SEASON YEAR", "WEEK", "SPECIES"]).count()["Positive"]

    new_df = pd.DataFrame({
        "Positive": pos,
        "Negative": neg,
        "Total": count
    }).reset_index()

    new_dict = new_df.to_dict("records")
    return jsonify(new_dict)


if __name__ == '__main__':
    app.run(debug=True)
