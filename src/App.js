import React from "react";
import {
  fetchAllTopics,
  deleteTopic,
  sortByName,
  addNewTopic,
  updateTopic,
  findByName,
  fetchPage
} from "./api/CoursesComponent";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const inputStyles = {
  border: "none",
  width: "100%",
  padding: "6px 2px"
};

class App extends React.Component {
  state = {
    topics: [],
    editedName: "",
    editedDesc: "",
    topicToEdit: null,
    open: false,
    page: 0,
    totalPages: 0,
    prevPage: true,
    nextPage: false,
    topicsBeforeSearch: [],
    searchKey: "Search",
    searchFocus: null,
    sortIcon: "angle down icon",
    sort: "desc"
  };

  componentDidMount = async () => {
    debugger;
    const response = await fetchAllTopics();
    console.log(response.data.totalPages);
    if (response.data.totalPages === 1) {
      //debugger;
      this.setState({ nextPage: true });
    }

    this.setState({
      topics: response.data.content,
      page: response.data.number,
      topicsBeforeSearch: response.data.content,
      totalPages: response.data.totalPages
    });
  };

  componentDidUpdate = () => {
    // debugger;
    // console.log(this.state.totalPages);
  };

  handleEditRow = topic =>
    this.setState({
      topicToEdit: topic.id,
      editedName: topic.name,
      editedDesc: topic.description
    });

  //to delete
  handleDeleteRow = async topicId => {
    await deleteTopic(topicId);
    const topicsInState = [...this.state.topics];
    this.setState(prevState => {
      const indexDelete = prevState.topics.findIndex(
        topic => topic.id === topicId
      );

      if (indexDelete !== -1) {
        topicsInState.splice(indexDelete, 1);
        return {
          topics: topicsInState
        };
      }
    });
  };

  renderDataRow(topic) {
    const disabled = Boolean(this.state.topicToEdit);
    return (
      <tr key={topic.id}>
        <td>{topic.id}</td>
        <td>{topic.name} </td>
        <td> {topic.description} </td>
        <td>
          <button className="ui icon button" disabled={disabled}>
            <i
              className="edit icon"
              onClick={() => this.handleEditRow(topic)}
            />
          </button>
          <button className="ui icon button" disabled={disabled}>
            <i
              className="trash icon"
              onClick={() => this.handleDeleteRow(topic.id)}
            />
          </button>
        </td>
      </tr>
    );
  }
  clearEdit = () =>
    this.setState({
      editedName: "",
      editedDesc: "",
      topicToEdit: null,
      searchFocus: false
    });
  handleNameChange = event => this.setState({ editedName: event.target.value });
  handleDescChange = event => this.setState({ editedDesc: event.target.value });

  handleClickOpen = () => {
    this.setState({ open: true });
  };
  handleCloseCancle = () => {
    this.setState({ open: false });
  };
  handleClose = async () => {
    this.setState({ open: false });
    const requestBody = {
      name: this.state.editedName,
      description: this.state.editedDesc
    };
    //console.log(requestBody);
    await addNewTopic(requestBody);

    const response = await fetchAllTopics();
    //console.log(response);
    //console.log(response.data)

    this.setState({
      topics: response.data.content
    });
    this.clearEdit();
  };

  handleUpdateRow = async () => {
    const requestBody = {
      id: this.state.topicToEdit,
      name: this.state.editedName,
      description: this.state.editedDesc
    };
    await updateTopic(requestBody.id, requestBody);

    this.setState(prevState => {
      const index = prevState.topics.findIndex(
        topic => topic.id === this.state.topicToEdit
      );
      prevState.topics[index] = requestBody;

      return {
        topics: [...prevState.topics]
      };
    });
    this.clearEdit();
  };
  handleKeyDown = e => {
    if (e.keyCode === 27) {
      this.clearEdit();
    }
  };
  renderEditableRow(topic) {
    return (
      <tr key={topic.id}>
        <td>{topic.id}</td>
        <td>
          <input
            style={inputStyles}
            type="text"
            value={this.state.editedName}
            onChange={this.handleNameChange}
            autoFocus
            onKeyDown={this.handleKeyDown}
          />
        </td>
        <td>
          <input
            style={inputStyles}
            type="text"
            value={this.state.editedDesc}
            onChange={this.handleDescChange}
            onKeyDown={this.handleKeyDown}
          />
        </td>
        <td>
          <button className="ui icon button" onClick={this.handleUpdateRow}>
            <i className="save icon" />
          </button>
        </td>
      </tr>
    );
  }

  handlePagePrev = async () => {
    let prePage = this.state.page - 1;
    debugger;
    const way = this.state.sort === "asc" ? "desc" : "asc";
    // if (this.state.sort === "asc") {
    //   way = "desc";
    // } else {
    //   way = "asc";
    // }
    const response = await fetchPage(prePage, "name", way);

    if (prePage === 0) {
      this.setState({
        topics: response.data.content,
        page: response.data.number,
        prevPage: true,
        nextPage: false
      });
    } else {
      this.setState({
        topics: response.data.content,
        page: response.data.number,
        nextPage: false
      });
    }
  };
  handlePageNext = async () => {
    debugger;
    let nexPage = this.state.page + 1;
    const way = this.state.sort === "asc" ? "desc" : "asc";
    const response = await fetchPage(nexPage, "name", way);

    //debugger;
    if (response.data.totalPages - this.state.page === 2) {
      this.setState({
        topics: response.data.content,
        page: response.data.number,
        prevPage: false,
        nextPage: true
      });
    } else {
      this.setState({
        topics: response.data.content,
        page: response.data.number,
        prevPage: false,
        nextPage: false
      });
    }
  };
  handleEnterKey = async e => {
    if (e.keyCode === 13) {
      let searchValue = e.target.value;
      this.setState({ searchKey: searchValue });

      const response = await findByName(searchValue);
      if (response.data != null) {
        let searchedResult = [];
        searchedResult.push(response.data);
        this.setState({ topics: searchedResult });
      }
    } else if (e.keyCode === 27) {
      this.clearEdit();
      //console.log(this.state.searchFocus);
      this.setState({ topics: this.state.topicsBeforeSearch });
    }
  };

  handleNameSort = async () => {
    if (this.state.sort === "desc") {
      const response = await sortByName("name", "desc");
      this.setState({
        topics: response.data.content,
        sort: "asc",
        sortIcon: "angle up icon"
      });
    } else {
      const response = await sortByName("name", "asc");
      this.setState({
        topics: response.data.content,
        sort: "desc",
        sortIcon: "angle down icon"
      });
    }
  };

  render() {
    //debugger;
    return (
      <div className="table-div" style={{ margin: "30px" }}>
        <div
          style={{ position: "relative", left: "1150px" }}
          className="ui small icon input"
        >
          <input
            type="text"
            placeholder="Search"
            onKeyDown={this.handleEnterKey}
            //onChange={this.handleEnterKey}
          />
          <i className="search icon" />
        </div>
        <Dialog
          open={this.state.open}
          onClose={this.handleCloseCancle}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add Details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Add topics ID, name and description
            </DialogContentText>
            <TextField
              margin="dense"
              id="name"
              label="Name"
              type="text"
              value={this.state.editedName}
              onChange={this.handleNameChange}
              fullWidth
            />
            <TextField
              margin="dense"
              id="desc"
              label="Description"
              type="text"
              value={this.state.editedDesc}
              onChange={this.handleDescChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <button className="ui primary button" onClick={this.handleClose}>
              {" "}
              Save
            </button>
            <button className="ui button" onClick={this.handleCloseCancle}>
              {" "}
              Cancle
            </button>
          </DialogActions>
        </Dialog>
        <table className="ui celled table">
          <thead>
            <tr>
              <th>ID </th>
              <th
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                Name
                <button
                  className="compact ui right floated icon button"
                  onClick={this.handleNameSort}
                >
                  <i className={this.state.sortIcon} />
                </button>
              </th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {this.state.topics.map(topic =>
              topic.id === this.state.topicToEdit
                ? this.renderEditableRow(topic)
                : this.renderDataRow(topic)
            )}
          </tbody>
        </table>
        <div align="center">
          <button
            className="ui blue left button"
            disabled={this.state.prevPage}
            onClick={this.handlePagePrev}
          >
            <i className="left arrow icon" />
          </button>
          <button
            disabled={this.state.nextPage}
            className="ui blue right button"
            onClick={this.handlePageNext}
          >
            <i className="right arrow icon" />
          </button>
          <button
            className="ui blue right floated button "
            onClick={this.handleClickOpen}
          >
            <i className="plus  icon" />
          </button>
        </div>
      </div>
    );
  }
}

export default App;
