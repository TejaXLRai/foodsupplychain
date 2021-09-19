import React, { Component } from "react";
import Layout from "../../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import { Link, Router } from "../../../routes";
import supplyChainInstance from "../../../ethereum/supplyChainInstance";

class CreateChain extends React.Component {
  state = {
    chainName: "",
    productName: "",
    productImageLink: "",
    ProductImageInforrmation: "",
    chainLocation: "",
    tagName: "",
    tagInformation: "",
    madeByCompanyName: "",
    madeByCompanyLogoLink: "",
    madeByCompanyInformation: "",
    madeByCompanyLocation: "",
    madeWith: "",
    productExpiredDay: "",
    productExpiredMonth: "",
    productExpiredYear: "",
    productArrivalDay: "",
    productArrivalMonth: "",
    productArrivalYear: "",
    errorMessage: "",
    successMessage: "",
    loading: false,
  };

  static async getInitialProps(props) {
    const supplyChain = supplyChainInstance(props.query.address);

    const summary = await supplyChain.methods.getSummary().call();

    var chainCount = (await summary[0]) - 0;
    var chainNames = [];

    if (chainCount > 0) {
      for (var x = 0; x < chainCount; x++) {
        var chains = await supplyChain.methods.chains(x).call();
        chainNames[x] = chains.productName;
      }
    }

    return {
      address: props.query.address,
      chainNames: chainNames,
    };
  }

  onSubmit = async (event) => {
    event.preventDefault();

    if (window.ethereum) {
      /*
                OPEN METAMASK AND ASSIGN TO METAMASK CONNECTED ACCOUNT
            */
      const connected_account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
                CREATE REACT STATE
            */
      const {
        chainName,
        productName,
        productImageLink,
        ProductImageInforrmation,
        chainLocation,
        tagName,
        tagInformation,
        madeByCompanyName,
        madeByCompanyLogoLink,
        madeByCompanyInformation,
        madeByCompanyLocation,
        madeWith,
        productExpiredDay,
        productExpiredMonth,
        productExpiredYear,
        productArrivalDay,
        productArrivalMonth,
        productArrivalYear,
      } = this.state;

      /*
                CREATE SUPPLY CHAIN INSTANCE
            */
      const supplyChain = supplyChainInstance(this.props.address);

      try {
        this.setState({ loading: true, errorMessage: "" });

        /*
                    SEND TRANSACTION TO CREATE CHAIN METHOD 
                */
        if (chainName != "") {
          await supplyChain.methods
            .createChain(
              chainName,
              productName,
              productImageLink,
              ProductImageInforrmation,
              chainLocation,
              tagName,
              tagInformation,
              madeByCompanyName,
              madeByCompanyLogoLink,
              madeByCompanyInformation,
              madeByCompanyLocation
            )
            .send({
              from: connected_account[0],
              chainId: 4,
            });
        }

        if (madeWith != "") {
          await supplyChain.methods.insertMadeWith(madeWith).send({
            from: connected_account[0],
            chainId: 4,
          });
        }

        /*
                    SEND TRANSACTION TO INSERT PRODUCT EXPIRED DATE METHOD 
                */
        if (productExpiredDay != "") {
          await supplyChain.methods
            .insertProductExpiredDate(
              productExpiredDay,
              productExpiredMonth,
              productExpiredYear
            )
            .send({
              from: connected_account[0],
              chainId: 4,
            });
        }

        /*
                    SEND TRANSACTION TO INSERT PRODUCT ARRIVAL DATE METHOD 
                */
        if (productArrivalDay != "") {
          await supplyChain.methods
            .insertProductArrivalDate(
              productArrivalDay,
              productArrivalMonth,
              productArrivalYear
            )
            .send({
              from: connected_account[0],
              chainId: 4,
            });
        }

        this.setState({ successMessage: "New Chain is created" });

        /*
                    6.  REDIRECT TO OTHER PAGE 
                */
        Router.pushRoute(`/supply-chain/${this.props.address}`);
      } catch (error) {
        this.setState({ errorMessage: error.message });
      }

      this.setState({ loading: false });
    }
  };

  checkboxOnChange = (event) => {
    var checkboxValue = event.target.value;
    var madeWith = this.state.madeWith;

    // comvert string to array
    var madeWithArray = madeWith.split("");
    if (madeWith != "") {
      var madeWithArray = madeWith.split(",");
    }

    var indexOfValue = madeWithArray.indexOf(checkboxValue.trim());

    if (event.target.checked) {
      /*
                Add Array, if the checkbox is checked 
            */
      if (indexOfValue !== -1) {
        // exist
      } else {
        // notExist
        madeWithArray.push(checkboxValue.trim());
      }
    } else {
      /*
                Remove Array, if the checkbox is unchecked 
            */
      if (indexOfValue !== -1) {
        // exist
        madeWithArray.splice(indexOfValue, 1); // 1 is remove 1 item
      }
    }

    // convert back array to string
    var madeWithString = madeWithArray.toString();
    this.setState({ madeWith: madeWithString });
  };

  render() {
    {
      console.log(this.state.madeWith);
    }

    return (
      <Layout>
        <Link route={`/supply-chain/${this.props.address}`}>
          <a>Back</a>
        </Link>

        <h3>Create a Chain</h3>

        <Form
          onSubmit={this.onSubmit}
          error={!!this.state.errorMessage}
          success={!!this.state.successMessage}
        >
          <Form.Field>
            <label>Chain Name</label>
            <Input
              value={this.state.chainName}
              onChange={(event) =>
                this.setState({ chainName: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Product Name</label>
            <Input
              value={this.state.productName}
              onChange={(event) =>
                this.setState({ productName: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Product Image Link</label>
            <Input
              value={this.state.productImageLink}
              onChange={(event) =>
                this.setState({ productImageLink: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Product Image Information</label>
            <Input
              value={this.state.ProductImageInforrmation}
              onChange={(event) =>
                this.setState({ ProductImageInforrmation: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Chain Location</label>
            <Input
              value={this.state.chainLocation}
              onChange={(event) =>
                this.setState({ chainLocation: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Tag Name</label>
            <Input
              value={this.state.tagName}
              onChange={(event) =>
                this.setState({ tagName: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Tag Information</label>
            <Input
              value={this.state.tagInformation}
              onChange={(event) =>
                this.setState({ tagInformation: event.target.value })
              }
            />
          </Form.Field>
          <br />
          <h4 style={{ color: "orange" }}> Made By : </h4>
          <Form.Field>
            <label>Company Name</label>
            <Input
              value={this.state.madeByCompanyName}
              onChange={(event) =>
                this.setState({ madeByCompanyName: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Company Logo Link</label>
            <Input
              value={this.state.madeByCompanyLogoLink}
              onChange={(event) =>
                this.setState({ madeByCompanyLogoLink: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Company Information</label>
            <Input
              value={this.state.madeByCompanyInformation}
              onChange={(event) =>
                this.setState({ madeByCompanyInformation: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Company Location</label>
            <Input
              value={this.state.madeByCompanyLocation}
              onChange={(event) =>
                this.setState({ madeByCompanyLocation: event.target.value })
              }
            />
          </Form.Field>
          <br />
          <h4 style={{ color: "orange" }}> Made With : </h4>
          {this.props.chainNames.map((chain_name) => {
            return (
              <div
                className="ui checkbox"
                style={{ display: "block", marginBottom: "10px" }}
              >
                <input
                  type="checkbox"
                  tabindex="0"
                  value={chain_name}
                  onChange={this.checkboxOnChange}
                />
                <label>{chain_name}</label>
              </div>
            );
          })}

          <hr />
          <h3>Product Expired Date</h3>
          <Form.Field>
            <label>Day</label>
            <Input
              value={this.state.productExpiredDay}
              onChange={(event) =>
                this.setState({ productExpiredDay: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Month</label>
            <Input
              value={this.state.productExpiredMonth}
              onChange={(event) =>
                this.setState({ productExpiredMonth: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Year</label>
            <Input
              value={this.state.productExpiredYear}
              onChange={(event) =>
                this.setState({ productExpiredYear: event.target.value })
              }
            />
          </Form.Field>
          <br />

          <hr />
          <h3>Product Arrival Date on Store</h3>

          <Form.Field>
            <label>Day</label>
            <Input
              value={this.state.productArrivalDay}
              onChange={(event) =>
                this.setState({ productArrivalDay: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Month</label>
            <Input
              value={this.state.productArrivalMonth}
              onChange={(event) =>
                this.setState({ productArrivalMonth: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Year</label>
            <Input
              value={this.state.productArrivalYear}
              onChange={(event) =>
                this.setState({ productArrivalYear: event.target.value })
              }
            />
          </Form.Field>
          <Message error header="Error" content={this.state.errorMessage} />
          <Message
            success
            header="Success"
            content={this.state.successMessage}
          />
          <Button loading={this.state.loading} primary>
            {" "}
            Create{" "}
          </Button>
        </Form>
        <br />
        <br />
      </Layout>
    );
  }
}
export default CreateChain;
