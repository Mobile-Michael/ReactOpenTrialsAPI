import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import "../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css";

const isExpandableRow = row => {
  return true;
};

let full_columns = [
  "status",
  "age_range",
  "target_sample_size",
  "gender",
  "interventions",
  "locations",
  "records",
  "documents",
  "brief_summary"
];

const arrayKeys = {
  interventions: "name",
  records: "url",
  documents: "name",
  locations: "name"
};

const build_p_element = (dataDict, title, index) => {
  const value = title in dataDict ? dataDict[title] : null;
  if (!value) return <p key={index}>{title} : No Data Available</p>;
  /*MPMDEV debug if (title === "age_range") {
    console.log(value);
  } else return null;*/

  //console.log(title + " type is: " + Object.prototype.toString.call(value));
  //console.log(dataDict);
  if (Object.prototype.toString.call(value) === "[object Object]") {
    if (title === "age_range") {
      return (
        <p>
          {title} : {value["min_age"]} - {value["max_age"]}
        </p>
      );
    } else {
      console.log("Unhandled object");
      return null;
    }
  } else if (Object.prototype.toString.call(value) === "[object Array]") {
    if (value.length === 0)
      return <p key={index}>{title} : No Data Available</p>;
    //lets just grab the name for right now DEVTEST and ceck
    const locations = value.map((elements, index) => {
      return index + 1 === value.length ? (
        <span key={index}> {elements[arrayKeys[title]]}</span>
      ) : (
        <span key={index}> {elements[arrayKeys[title]]},</span>
      );
    });

    return (
      <p key={index}>
        {title} : {locations}
      </p>
    );
  }

  if (value)
    return (
      <p key={index}>
        {title} : {value}
      </p>
    );
};

const getDetailsOnTrial = row => {
  const results = full_columns.map((element, index) => {
    return build_p_element(row, element, index);
  });
  return <div>{results}</div>;
};

const expandRow = row => {
  return getDetailsOnTrial(row);
};

class SearchResultsTable extends Component {
  state = {};

  render() {
    const onSelectRow = (row, isSelected, e) => {
      console.log("selected: ", row, isSelected, e);
      this.props.selectedRow(row["id"], isSelected);
    };

    const onSelectAll = isSelected => {};

    //DEVTEST could add a secondary table to display the results of a select if expandable doesnt work

    //only used if youd prefer checkbox
    const selectRowProp = {
      mode: "checkbox",
      clickToSelect: false,
      clickToExpand: true,
      unselectable: [2],
      selected: [1],
      onSelect: onSelectRow,
      onSelectAll: onSelectAll,
      bgColor: "gold"
    };

    const showTotal = () => {
      return <p>There are {this.props.data.length} items total</p>;
    };

    const options = {
      expandRowBgColor: "lightgrey",
      expanding: [1], // initially expanded
      paginationShowsTotal: showTotal
    };

    return (
      <div>
        <BootstrapTable
          data={this.props.data}
          pagination={true}
          selectRow={selectRowProp}
          expandableRow={isExpandableRow}
          expandComponent={expandRow}
          expandColumnOptions={{ expandColumnVisible: true }}
          options={options}
        >
          <TableHeaderColumn isKey dataField={"public_title"} width="100%">
            Public Title
          </TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}

export default SearchResultsTable;
