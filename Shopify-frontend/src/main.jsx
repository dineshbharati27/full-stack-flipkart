import React from "react";
// import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";

// ReactDOM.render(
  
//   document.getElementById("root")
// );


// import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Provider store={store}>
  <App />
</Provider>,);
