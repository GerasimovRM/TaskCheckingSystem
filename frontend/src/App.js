import React from "react";
import Info from "./components/info"
import Form from "./components/form"

class App extends React.Component {
    render() {
      return (
        <div>
          <Info />
          <Form />
        </div>
      );
    };
}

export default App;
