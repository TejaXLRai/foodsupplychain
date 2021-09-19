import React, { Component } from "react";
import Layout from "../components/Layout";
import supplyChainFactoryInstance from "../ethereum/supplyChainFactoryInstance";
import supplyChainInstance from "../ethereum/supplyChainInstance";
import { Card, Button } from "semantic-ui-react";
import { Link } from "../routes";

class SupplyChainIndex extends React.Component {
  static async getInitialProps(props) {
    const supplyChainFactory = await supplyChainFactoryInstance.methods
      .getDeployedSupplyChain()
      .call();
    var supplyChainsArray = [];

    if (supplyChainFactory.length > 0) {
      for (var x = 0; x < supplyChainFactory.length; x++) {
        var supplyChainObject = {};
        var address = supplyChainFactory[x];
        var supplyChain = supplyChainInstance(address);

        supplyChainObject["title"] = await supplyChain.methods
          .supplyChainTitle()
          .call();
        supplyChainObject["address"] = address;
        supplyChainsArray[x] = supplyChainObject;
      }
    }

    return {
      supplyChainsArray: supplyChainsArray,
    };
  }

  listSupplyChains() {
    const items = this.props.supplyChainsArray.map((info) => {
      var infoString = info["title"] + " ( " + info["address"] + " ) ";
      // delicious fried rice recipe ( 0X29374923426349832834834 )

      return {
        header: (
          <div className="header" style={{ textTransform: "capitalize" }}>
            {infoString}
          </div>
        ),
        description: (
          <Link route={`/supply-chain/${info["address"]}`}>
            <a>View Supply Chain</a>
          </Link>
        ),
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>List of Supply Chains</h3>
          <Link route="/supply-chain/new">
            <a>
              <Button
                floated="right"
                content="Create Supply Chain"
                primary
                labelPosition="right"
              />
            </a>
          </Link>
          {this.listSupplyChains()}
        </div>
      </Layout>
    );
  }
}

export default SupplyChainIndex;
