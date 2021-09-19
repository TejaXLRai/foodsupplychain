import React, { Component } from "react";
import Layout from "../../components/Layout";
import supplyChainInstance from "../../ethereum/supplyChainInstance";
import { Grid, Card, Button, Popup, Image } from "semantic-ui-react";
import { Link } from "../../routes";
import ModalBox from "../../components/Modal";
import CompanyLogoModal from "../../components/CompanyLogoModal";

class SupplyChainShow extends React.Component {
  static async getInitialProps(props) {
    const supplyChain = supplyChainInstance(props.query.address);
    const summary = await supplyChain.methods.getSummary().call();
    var chainCount = summary[0] - 0;
    var chainsData = [];

    if (chainCount > 0) {
      for (var x = 0; x < chainCount; x++) {
        // to create associative array
        var info = {};

        info["chains"] = await supplyChain.methods.chains(x).call();
        info["companyInformations"] = await supplyChain.methods
          .companyInformations(x)
          .call();

        var madeWithInsertedOnChain =
          (await supplyChain.methods.madeWithInsertedOnChain().call()) - 1;
        if (madeWithInsertedOnChain == x) {
          info["madeWith"] = await supplyChain.methods.madeWith().call();
        } else {
          info["madeWith"] = "";
        }

        var productExpiredDateInsertedOnChain =
          (await supplyChain.methods
            .productExpiredDateInsertedOnChain()
            .call()) - 1;
        if (productExpiredDateInsertedOnChain == x) {
          var day = await supplyChain.methods.productExpiredDay().call();
          var month = await supplyChain.methods.productExpiredMonth().call();
          var year = await supplyChain.methods.productExpiredYear().call();

          info["productExpiredDate"] = {
            day: day,
            month: month,
            year: year,
          };
        } else {
          info["productExpiredDate"] = {
            day: 0,
          };
        }

        var productArrivalDateInsertedOnChain =
          (await supplyChain.methods
            .productArrivalDateInsertedOnChain()
            .call()) - 1;
        if (productArrivalDateInsertedOnChain == x) {
          var day = await supplyChain.methods.productArrivalDay().call();
          var month = await supplyChain.methods.productArrivalMonth().call();
          var year = await supplyChain.methods.productArrivalYear().call();

          info["productArrivalDate"] = {
            day: day,
            month: month,
            year: year,
          };
        } else {
          info["productArrivalDate"] = {
            day: 0,
          };
        }

        chainsData[x] = info;
      }
    }

    return {
      address: props.query.address,
      chainsCount: chainCount,
      manufactureAddress: summary[1],
      supplyChainTitle: summary[2],
      chainsData: chainsData,
    };
  }

  renderCards() {
    const { address, chainsCount, manufactureAddress } = this.props;

    const items = [
      {
        header: manufactureAddress,
        meta: "Address of Manufacture",
        description: "The manufacture created this supply chain",
        style: { overflowWrap: "break-word" },
      },
      {
        header: chainsCount,
        meta: "Number of Chains",
        description:
          "An individual chain that form the complete supply chain ( or supply chain journey )",
        style: { overflowWrap: "break-word" },
      },
    ];

    return <Card.Group items={items} />;
  }

  createAnchorLink(_productName) {
    _productName = _productName.trim();
    var search = /([ ])+/g;
    var anchorLink = _productName.replace(search, "-");
    anchorLink = "#" + anchorLink;

    return anchorLink;
  }

  createId(_productName) {
    _productName = _productName.trim();
    var search = /([ ])+/g;
    var newProductName = _productName.replace(search, "-");
    return newProductName;
  }

  convertMonth(numericMonth) {
    var month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return month[0];
  }

  madeWithAnchorLinks(_madeWith) {
    var madeWithArray = _madeWith.split(",");

    var links = [];

    const lastValueOfMadeWithArray = madeWithArray[madeWithArray.length - 1];

    madeWithArray.forEach(function (ingredient) {
      var search = /([ ])+/g;
      var ingredientAnchor = ingredient.replace(search, "-");
      ingredientAnchor = "#" + ingredientAnchor;

      var comma = ",";
      if (lastValueOfMadeWithArray == ingredient) {
        comma = "";
      }

      links.push(
        <a className="madeWith" href={`${ingredientAnchor}`}>
          {ingredient} {comma}{" "}
        </a>
      );
    });

    return links;
  }

  render() {
    return (
      <Layout>
        <br />
        <h2 id="top" className="journeyTitle">
          {" "}
          {this.props.supplyChainTitle}{" "}
        </h2>
        <Grid>
          <Grid.Row>
            <Grid.Column>{this.renderCards()}</Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid.Row>
          <Grid.Column>
            <br />
            <Link route={`/supply-chain/${this.props.address}/create-chain`}>
              <a>
                <Button primary>Create Chain</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>

        <br />
        <br />
        <hr />
        <br />
        <h2 id="top" className="journeyTitle2">
          {" "}
          See the journey of your product{" "}
        </h2>
        {this.props.chainsData.map((datas) => {
          return (
            <div className="journeyLink">
              <img src={datas.chains.productImageLink} />
              <h3>{datas.chains.chainName}</h3>
              <a href={this.createAnchorLink(datas.chains.productName)}>
                {datas.chains.productName}
              </a>
            </div>
          );
        })}
        <br />
        <br />
        {this.props.chainsData.map((data) => {
          return (
            <div
              class="ui card card-container"
              id={this.createId(data.chains.productName)}
            >
              <div class="content">
                <div class="header">{data.chains.chainName}</div>
              </div>
              {data.chains.productName != "" ? (
                <div class="content">
                  <div class="description">
                    <Popup
                      content={data.chains.ProductImageInformation}
                      header={"Product Information"}
                      trigger={
                        <img
                          src={data.chains.productImageLink}
                          class="ui small image floated left logoImage"
                        />
                      }
                    />

                    <p className="companyNameStyle">
                      {data.chains.productName}
                    </p>
                    <p className="companyLocationStyle">
                      {data.chains.chainLocation}
                    </p>
                  </div>
                </div>
              ) : (
                ""
              )}
              {data.chains.tagName != "" ? (
                <div className="content">
                  <div className="description">
                    <ModalBox
                      tagName={data.chains.tagName}
                      tagInformation={data.chains.tagInformation}
                      className="tagName"
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              {data.productExpiredDate.day != 0 ? (
                <div className="content">
                  <h4>Product Expired Date</h4>
                  <div className="description">
                    <span>{data.productExpiredDate.year}, </span>
                    <span>
                      {this.convertMonth(data.productExpiredDate.month)}{" "}
                    </span>
                    <span>{data.productExpiredDate.day}</span>
                  </div>
                </div>
              ) : (
                ""
              )}
              {data.productArrivalDate.day != 0 ? (
                <div className="content">
                  <h4>Product Arrival Date ( on Store )</h4>
                  <div className="description">
                    <span>{data.productArrivalDate.year}, </span>
                    <span>
                      {this.convertMonth(data.productArrivalDate.month)}{" "}
                    </span>
                    <span>{data.productArrivalDate.day}</span>
                  </div>
                </div>
              ) : (
                ""
              )}
              {data.madeWith != "" ? (
                <div className="content">
                  <h4>Made with</h4>
                  <div className="description">
                    {this.madeWithAnchorLinks(data.madeWith)}
                  </div>
                </div>
              ) : (
                ""
              )}
              {data.companyInformations.madeByCompanyName != "" ? (
                <div className="content">
                  <h4 style={{ marginTop: "0" }}>Made By</h4>
                  <div className="description">
                    <CompanyLogoModal
                      companyInformation={
                        data.companyInformations.madeByCompanyInformation
                      }
                      conpanyLogoLink={
                        data.companyInformations.madeByCompanyLogoLink
                      }
                    />
                    <p className="companyNameStyle">
                      {data.companyInformations.madeByCompanyName}
                    </p>
                    <p className="companyLocationStyle">
                      {data.companyInformations.madeByCompanyLocation}
                    </p>
                    <div style={{ clear: "both" }}></div>
                  </div>
                </div>
              ) : (
                ""
              )}
              <a className="topLink" href="#top">
                Top
              </a>
            </div>
          );
        })}
      </Layout>
    );
  }
}
export default SupplyChainShow;
