import React, { useState, useEffect, useRef } from "react";

//useTitle useEffect/////
const useTitle = initialTitle => {
  const [title, setTitle] = useState(initialTitle);
  const updateTitle = () => {
    const htmlTitle = document.querySelector("title");
    htmlTitle.innerText = title;
  };
  useEffect(updateTitle, [title]);
  return setTitle;
};
////////////////////////
//useInput///////////
const useInput = (initialValue, vaildator) => {
  const [value, setValue] = useState(initialValue);
  const onChange = event => {
    const {
      target: { value }
    } = event;
    let willUpdate = true;
    if (typeof vaildator === "function") {
      willUpdate = vaildator(value);
    }
    if (willUpdate) {
      setValue(value);
    }
  };
  return { value, onChange };
};
// useTabs/////////
const content = [
  {
    tab: "section1",
    content: "loerm111"
  },
  {
    tab: "section2",
    content: "loerm222"
  }
];

const useTabs = (initialTab, allTabs) => {
  const [currentInedex, setCurrentIndex] = useState(initialTab);
  return { currentItem: allTabs[currentInedex], changeItem: setCurrentIndex };
};
// useClick useRef useEffect//
const useClick = onClick => {
  const element = useRef();
  //componentDidMount
  useEffect(() => {
    if (element.current) {
      element.current.addEventListener("click", onClick);
    }
    //componentWillunmount
    return () => {
      if(element.current){
        element.current.removeEventListener("click", onClick);
      } 
    }
  }, []);
  if(typeof onClick !== "function"){
    return;
  }
  return element;
};
///////////////////////
// useconfirm
const useConfirm = (message = "", onConfirm, onCancel) => {
  if (!onConfirm || typeof onConfirm !== "function") {
    return;
  }
  if (onCancel && typeof onCancel !== "function") {
    return;
  }
  const confirmAction = () => {
    if (window.confirm(message)) {
      onConfirm();
    } else {
      onCancel();
    }
  };
  return confirmAction;
};
/////////////////////////////
// usePreventLeave
const usePreventLeave = () => {
  const Listener = event => {
    event.preventDefault();
    event.returnValue = "";
  };
  const enablePrevent = () => window.addEventListener("beforeunload", Listener);
  const disablePrevent = () => window.removeEventListener("beforeunload", Listener);
  return { enablePrevent, disablePrevent };
};
////////////////////////////
// useBeforeLeave
const useBeforeLeave = onBefore => {
  const handle = event => {
    const { clientY } = event;
    if (clientY <= 0) {
      onBefore();
    }
  };
  useEffect(() => {
    document.addEventListener("mouseleave", handle);
    return () => document.removeEventListener("mouseleave", handle);
  }, []);
  if (typeof onBefore !== "function") {
    return;
  }
};
////////////////////
// count 
function UseInput() {
  const [count, setCount] = useState(0);
  function increseCount() {
    return setCount(count + 1);
  }
  function decreseCount() {
    return setCount(count - 1);
  }
  //////////////////
  // 불리언 함수
  const maxlen = value => value.length < 10;

  const name = useInput("Mr.", maxlen);
  //////////////////
// useTab
  const { currentItem, changeItem } = useTabs(0, content);
  ///////////////// 
  // useEffect
  const sayHello = () => {
    console.log("Hello");
  };
  const [number, setNumber] = useState(0);
  const [aNumber, setaNumber] = useState(0);
  useEffect(sayHello,[number, aNumber])
  ////////////////
  // useTitle useEffect//
  const titleUpdater = useTitle("Loading...");
  setTimeout(() => titleUpdater("home"), 5000);
  //////////////////////
  // useClick useRef useEffect//
  const sayBye = () => console.log('bye')
  const title = useClick(sayBye);
  ///////////////////////
  // useConfirm//
  const confirmMessage = () => console.log("Deleting confirm");
  const abort = () => console.log("Aborted!");
  const confirmDelete = useConfirm("Are you sure?", confirmMessage, abort);
  ///////////////////////
  // usePreventLeave
  const { enablePrevent, disablePrevent } = usePreventLeave();
  /////////////////////
  // useBeforeLeave
  const begForLife = () => {
    console.log("pls dont leave");
  };
  useBeforeLeave(begForLife);
  ///////////////////////
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>{count}</h2>
      <input placeholder="name" {...name} />  
      <button onClick={increseCount}>plus</button>
      <button onClick={decreseCount}>minus</button>
      <h2>Start editing to see some magic happen!</h2>
      {/* useTab */}
      {content.map((section, index) => (
        <button onClick={() => changeItem(index)}>{section.tab}</button>
      ))}
      <div>{currentItem.content}</div>
      {/* ///////////// */}
      {/* useEffect */}
      <button onClick={() => setNumber(number + 1)}>{number}</button>
      <button onClick={() => setaNumber(aNumber + 1)}>{aNumber}</button>
      {/* //////////////// */}
      {/* //useClick */}
      <h1 ref={title}>Click</h1>
      {/* useConfirm */}
      <button onClick={confirmDelete}>Delete confirm</button>
      {/* usePreventLeave */}
      <button onClick={enablePrevent}>enablePrevent</button>
      <button onClick={disablePrevent}>disablePrevent</button>
    </div>
  );
}

export default UseInput;
