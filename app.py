from flask import Flask, render_template, jsonify
import pandas as pd
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask_sqlalchemy import SQLAlchemy

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


@app.route("/names")
def names():
    # Return a list of column names

    return jsonify(list(df.columns))


@app.route("/positives/")
def postives():
    # Return a dictionary of only positive results

    pos_df = df[df.RESULT == "positive"].reset_index()
    pos_dict = pos_df.to_dict(orient="index")

    return jsonify(pos_dict)


@app.route("/positives/year/<year>")
def postives_year(year):
    # Return a dictionary of only positive results
    year = int(year)
    pos_df = df[(df.RESULT == "positive") & (
        df["SEASON YEAR"] == year)].reset_index()
    pos_dict = pos_df.to_dict(orient="index")

    return jsonify(pos_dict)


@app.route("/positives/ward/<ward>")
def postives_ward(ward):
    # Return a dictionary of only positive results
    ward = int(ward)
    pos_df = df[(df.RESULT == "positive") & (
        df["Wards"] == ward)].reset_index()
    pos_dict = pos_df.to_dict(orient="index")

    return jsonify(pos_dict)


if __name__ == '__main__':
    app.run(debug=True)
