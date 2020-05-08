import React, { useState, useEffect, useRef } from "react";
import defaultAxios from 'axios';
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
//useFadeIn 
const useFadeIn = (duration = 1, delay = 0) => {
  const element = useRef();
  useEffect(() => {
    if (element.current) {
      const { current } = element;
      current.style.transition = `opacity ${duration}s ease-in-out ${delay}s`;
      current.style.opacity = 1;
    }
  }, []);
  if (typeof duration !== "number" || typeof delay !== "number") {
    return;
  }
  return { ref: element, style: { opacity: 0 } };
};
/////////////////////
// useNetwork
const useNetwork = onChange => {
  const [status, setStatus] = useState(navigator.onLine);
  const handleChange = () => {
    if (typeof onChange === "function") {
      onChange(navigator.onLine);
    }
    setStatus(navigator.onLine);
  };

  useEffect(() => {
    window.addEventListener("online", handleChange);
    window.addEventListener("offline", handleChange);
    return () => {
      window.removeEventListener("online", handleChange);
      window.removeEventListener("offline", handleChange);
    };
  }, []);

  return status;
};
//////////////////////
// useScroll
const useScroll = () => {
  const [state, setState] = useState({
    x: 0,
    y: 0
  });
  const onScroll = () => {
    setState({ x: window.scrollX, y: window.scrollY });
  };
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
  }, []);
  return state;
};
//////////////////////
// useFullScreen
const useFullscreen = callback => {
  const element = useRef();
  const runCb = isFull => {
    if (callback && typeof callback === "function") {
      callback(isFull);
    }
  };
  const triggerFull = () => {
    if (element.current) {
      element.current.requestFullscreen();
    }
    runCb(true);
  };
  const exitFull = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    runCb(false);
  };
  return { element, triggerFull, exitFull };
};
///////////////////////
// useAxios
const useAxios = (opts, axiosInstance = defaultAxios) => {
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null
  });
  const [trigger, setTrigger] = useState(0);

  const refetch = () => {
    setState({
      ...state,
      loading: true
    });
    setTrigger(Date.now());
  };
  useEffect(() => {
    axiosInstance(opts)
      .then(data => {
        setState({
          ...state,
          loading: false,
          data
        });
      })
      .catch(error => {
        setState({
          ...state,
          loading: false,
          error
        });
      });
  }, [trigger]);
  if (!opts.url) {
    return;
  }
  return { ...state, refetch };
};
///////////////////////
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
  // useFadeIn
  const fadeInH1 = useFadeIn(1, 2);
  const fadeInH2 = useFadeIn(2, 5);
  /////////////////////
  // useNetwork
  const handleNetworkChange = onLine => {
    console.log(onLine ? "onLine" : "offLine");
  };
  const onLine = useNetwork(handleNetworkChange);
  ////////////////////
  // useScroll
  const { y } = useScroll();
  ////////////////////
  // useFullscreen
  const onFulls = isFull => {
    console.log(isFull ? "It is Full" : "Isn't Full");
  };
  const { element, triggerFull, exitFull } = useFullscreen(onFulls);
  ////////////////////
  // useAxios
  const { loading, data, error, refetch } = useAxios({
    url: "https://yts.mx/api/v2/list_movies.json"
  });
  ////////////////////////
  return (
    <div className="App" style={{ height: "1000vh" }}>
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
      {/* useFadeIn */}
      <h1 {...fadeInH1}>Hello CodeSandbox</h1>
      <h2 {...fadeInH2}>Start editing to see some magic happen!</h2>
      {/* useNetwork */}
      <h1>{onLine ? "onLine" : "offLine"}</h1>
      {/* useScroll */}
      <h1 style={{ position: "fixed", color: y > 100 ? "red" : "blue" }}>HI</h1>
      {/* useFullScreen */}
      <div ref={element}>
        <img src="https://images.unsplash.com/photo-1559745136-655039d6be9c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60" />
        <div>
          <button onClick={exitFull}>ExitScreen</button>
        </div>
      </div>
      <button onClick={triggerFull}>FullScreen</button>
      {/* useAxios */}
      <h1>{data && data.status}</h1>
      <h2>{loading && "Loading"}</h2>
      <button onClick={refetch}>refetch</button>
    </div>
  );
}

export default UseInput;
