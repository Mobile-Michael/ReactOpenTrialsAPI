import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import SearchTableResults from "./Components/SearchResultsTable";
import SearchInput from "./Components/SearchInput";
import jsPDF from "jspdf";

const MIN_RESULTS = 10;
const MAX_RESULTS = 100;

class App extends Component {
  state = {
    results: [],
    page_index: 1,
    results_per_page: MAX_RESULTS,
    current_search: ""
  };

  createUrl = (searchInput, exactMatch) => {
    let results_per_page =
      this.state.results_per_page >= MIN_RESULTS
        ? this.state.results_per_page
        : MIN_RESULTS;
    results_per_page =
      results_per_page > MAX_RESULTS ? MAX_RESULTS : results_per_page;

    let url = "https://api.opentrials.net/v1/search?q=public_title%3A";
    if (exactMatch) url += "'" + this.state.current_search + "'&";
    else url += this.state.current_search + "&";
    url +=
      "page=" +
      this.state.page_index.toString() +
      "&per_page=" +
      results_per_page.toString();
    console.log(url);
    return url;
  };

  parseResults = data => {
    //items and total count
    if (data["items"].length > 0) this.setState({ results: data["items"] });
    else {
      alert("No Results! Try again with a broader search");
      this.setState({ results: [] });
    }
  };

  onSearchClickedExactMatch = () => {
    this.searchOpenTrials(true);
  };
  onSearchClicked = () => {
    this.searchOpenTrials(false);
  };

  searchChangedHandler = event => {
    this.setState({ current_search: event.target.value });
  };

  onRowSelected = (row_id_array, isSelected) => {
    console.log("Rwo selected passed back");
    console.log(row_id_array);
  };

  downloadPDF = () => {
    console.log("Download PDF Called");
    alert("Download Not Finished Yet");
    return;
    var doc = new jsPDF();
    /*requirements 
    A header that contains the name of a fictitious company, a visual of some sort, and the
    search term this selection set came from
    ○ A table with one trial per row, containing the following columns:
    ■ public_title
    ■ all interventions
    ■ all locations*/

    //

    doc.save("trial_results.pdf");
  };

  //DEVTEST Funcitionality to add
  //3.) sorting?

  searchOpenTrials = exactMatch => {
    let searchString = this.state.current_search;
    if (!String.prototype.trim) {
      String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "");
      };
    }

    searchString = searchString.trim();

    if (searchString.length === 0) {
      console.log("NO INPUT");
      this.setState({ results: [] });
      return;
    }

    console.log("Searching");
    const url = this.createUrl(searchString, exactMatch);
    axios
      .get(url)
      .then(response => {
        console.log(response.data);
        if (response.data) {
          this.parseResults(response.data);
        } else {
          alert("No API Results");
        }
      })
      .catch(error => {
        alert("Error: " + error);
      });
  };

  componentDidMount() {}

  render() {
    const downloadButton = (
      <button
        type="button"
        className="btn btn-success m4"
        onClick={this.downloadPDF}
        style={{ marginRight: "0.8rem" }}
      >
        Download Results
      </button>
    );
    // <button
    // type="button"
    //   className="btn btn-primary m4"
    //  onClick={this.onSearchClickedExactMatch}
    //   >Download Selected</button>; : return null;

    return (
      <div className="App">
        <SearchInput changed={this.searchChangedHandler} />

        <button
          type="button"
          className="btn btn-primary m4"
          onClick={this.onSearchClicked}
          style={{ marginRight: "0.8rem" }}
        >
          Search Now!
        </button>

        <button
          type="button"
          className="btn btn-primary m4"
          onClick={this.onSearchClickedExactMatch}
          style={{ marginRight: "0.8rem" }}
        >
          Search Exact Match!
        </button>

        {this.state.results.length > 0 ? downloadButton : null}
        <hr />
        <SearchTableResults
          data={this.state.results}
          selectedRow={id => {
            this.onRowSelected(id);
          }}
        />
      </div>
    );
  }
}

export default App;
