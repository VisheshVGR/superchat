import React, { useEffect, useState, useRef } from 'react'
import './App.css';
import { auth, db } from "./firebase.js"
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot, } from "firebase/firestore";
// import Picker from 'emoji-picker-react';


const provider = new GoogleAuthProvider();


function App() {

  // useState
  const [currUser, setCurrUser] = useState(null);
  const [messages, setMessages] = useState([]);
  // const [currMessage, setCurrMessage] = useState("");
  // const [showEmojiPanel, setShowEmojiPanel] = useState(false)
  // const [chosenEmoji, setChosenEmoji] = useState(null);

  // useRef
  const currMsgRef = useRef();
  const scrollToBottom = useRef();


  // useEffect
  // Live updating new messages
  useEffect(() => {
    // console.log("curr user has been updated")
    // const loadData = async () => {
    //   const messagesRef = collection(db, "superchat-messages")
    //   const q = query(messagesRef, orderBy("createdAt"), limit(25))
    //   const querySnapshot = await getDocs(q)

    //   console.log("chat loading.............................")
    //   const tempMessages = []
    //   querySnapshot.forEach((doc) => {
    //     tempMessages.push({ ...doc.data(), key: doc.id })

    //   });
    //   setMessages(tempMessages)
    // }
    // if (currUser)
    //   loadData()

    // getRealtimeUpdate();
    const messagesRef = collection(db, "superchat-messages")
    const q = query(messagesRef, orderBy("createdAt", "desc"), limit(200))
    // console.log("step0")

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempMessages = []
      // console.log("step1")
      querySnapshot.forEach((doc) => {
        // console.log("step2")

        tempMessages.push({ ...doc.data(), key: doc.id })
      });
      tempMessages.reverse()
      // console.log("step3")

      setMessages(tempMessages)
      // console.log(tempMessages)
    });
    if (!currUser) {
      unsubscribe()
      return
    }
    // unsubscribe(); 

  }, [currUser])

  // const onEmojiClick = (event, emojiObject) => {
  //   event.preventDefault();
  //   // setChosenEmoji(emojiObject);
  //   // currMsgRef.current.text
  //   // console.log(currMsgRef.current.value)
  //   // currMsgRef.current.value += emojiObject.emoji;
  //   setCurrMessage(currMessage + emojiObject.emoji)
  // };


  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider)
      // console.log("SUCCESFULLY LOGGED IN")
      // setCurrUser(result)
    } catch (e) {
      console.log("LOG IN ERROR", e)
    }
  }

  const signOutWithGoogle = () => {
    signOut(auth).then(() => {
      // console.log("SUCCESSFULLY LOGGED OUT")
      // setCurrUser(null)
    }).catch((error) => {
      console.log("LOG OUT ERROR", error)
    });
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrUser(user)
    } else {
      setCurrUser(null)
    }
  });

  const sendNewMessage = async () => {
    // console.log(currMsgRef.current.value.trim())
    if (currMsgRef.current.value.trim() === "")
      return
    // if (currMessage.trim() === "")
    //   return
    // console.log(currUser)
    try {
      await addDoc(collection(db, "superchat-messages"), {
        text: currMsgRef.current.value.trim(),
        createdAt: serverTimestamp(),
        uid: currUser.uid,
        photoURL: currUser.photoURL,
        displayName: currUser.displayName
      });
      // console.log("Document written with ID: ", docRef.id);
      // setCurrMessage("")
      currMsgRef.current.value = ""
      // currMsgRef.current.focus()

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  // const getRealtimeUpdate = () => {


  // }

  const ChatMessage = (props) => {
    // console.log("DISPLAYING NEW MESSAGE => ", props.data.text)
    const { text, uid, displayName, photoURL } = props.data;
    // console.log(uid, currUser.uid)
    const messageClass = uid === currUser.uid ? "sent" : "received"
    // console.log("photourl", photoURL)
    return (
      <>
        <div className={`chat-single-message ${messageClass}`}>
          <img src={photoURL} alt="" />
          <p>
            <span className="displayName">{displayName}</span>
            {text}
          </p>
        </div>
      </>
    )
  }

  // enter to send message shortcut
  const manageShortcuts = (e) => {
    // if (e.shiftKey && e.key === "Enter") {
    //   sendNewMessage()
    // }
    if (e.key === "Enter") {
      sendNewMessage()
    }
  }

  // PAGES
  const Nav = () => {
    // console.log('nav rendered')

    return (
      <>
        <nav className='nav-bar'>

          <div className='nav-profile-icon'>
            {/* <i className="fas fa-user-circle"></i> */}
          </div>
          <div className='nav-heading'>
            <i className="fas fa-ghost bounce"></i> superChat
          </div>
          <div className=''>
            {currUser ?
              <i onClick={signOutWithGoogle} className="fas fa-sign-out-alt nav-sign-btn"> Sign Out</i>
              :
              <i onClick={signInWithGoogle} className="fas fa-sign-in-alt nav-sign-btn"> Sign In</i>}
          </div>

        </nav>
      </>
    )
  }

  const Chat = () => {
    // console.log('chat rendered')
    // currMsgRef.current.focus()

    useEffect(() => {
      scrollToBottom.current.scrollIntoView();
    }, [])


    // const messagesRef = collection(db, "superchat-messages")
    // const q = query(messagesRef, orderBy("createdAt"), limit(25))
    // const querySnapshot = await getDocs(q)

    // console.log("chat loading.............................")
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   // console.log(doc.id, " => ", doc.data().text);
    //   // setWorldMessages([...worldMessages, doc.data()])
    //   setMessages([...messages, doc.data()])

    // });
    // // querySnapshot.forEach((doc) => {
    // //   // doc.data() is never undefined for query doc snapshots
    // //   // console.log(doc.id, " => ", doc.data());
    // //   setWorldMessages([...worldMessages, doc.data()])
    // // });

    // const q = query(collection(db, "cities"), where("state", "==", "CA"));

    // const messagesRef = collection(db, "superchat-messages")
    // const q = query(messagesRef, orderBy("createdAt"), limit(25))

    // const messages = [];

    // const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     messages.push(doc.data());
    //   });
    //   // console.log("Current messages in CA: ", messages.join(", "));
    // });

    // unsubscribe()



    // messages.forEach((msg) => {
    //   console.log(msg)
    // })

    // setShowEmojiPanel(false)

    // const emojiPickerCss = {
    //   position : "absolute",
    //   // transfrom: `translate(-94px, -221px)`,
    //   height : `${showEmojiPanel ? "320px" : "0"}`,
    //   // width : "-280px"
    //   right: "20px",
    //   top: "-340px",
    //   border: "0",
    // }

    return (
      <>
        <section className='chat-container'>
          <div className='chat-box'>
            {messages && messages.map((msg) => <ChatMessage key={msg.key} data={msg} />)}
            <div ref={scrollToBottom}></div>
          </div>
          <div className='chat-form'>


            <input autoFocus className='chat-text-area' onKeyPress={manageShortcuts} ref={currMsgRef} placeholder='Send SuperChat...' />

            {/* <Picker disableSearchBar={false} disableSkinTonePicker={true} pickerStyle={emojiPickerCss} onEmojiClick={onEmojiClick} /> */}
            {/* <div className='chat-send-btn' onClick={()=>setShowEmojiPanel(!showEmojiPanel)}>
              <i className="far fa-smile"></i>
            </div> */}


            <div className='chat-send-btn' onClick={sendNewMessage}>
              <i className="fas fa-paper-plane"></i>
            </div>
          </div>

        </section>

      </>
    )
  }

  const Home = () => {
    // console.log('home rendered')

    const Social = () => {
      return (
        <section>
          <div className="wrapper">
            <div className="button-social" onClick={() => window.open("https://www.instagram.com/vishesh22_17/")}>
              <div className="icon">
                <i className="fab fa-instagram"></i>
              </div>
              <span>Instagram</span>
            </div>

            <div className="button-social" onClick={() => window.open("https://www.linkedin.com/in/vishesh-vgr/")}>
              <div className="icon">
                <i className="fab fa-linkedin"></i>
              </div>
              <span>Linkedin</span>
            </div>

            <div className="button-social" onClick={() => window.open("https://github.com/VisheshVGR")}>
              <div className="icon">
                <i className="fab fa-github"></i>
              </div>
              <span>Github</span>
            </div>
          </div>
        </section>
      )
    }



    return (
      <>
        <section className='home-container'>
          <div className='home-section-1'>
          <div className="baba">
            <ul>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
            <span>&gt;</span> Hello😃 SuperUser🚀<br/>
            <span>&gt;</span> Want to Chat💬 with the World<br/>
            <span>&gt;</span> Introducing <div className='nav-heading home-superchat-logo'><i className="fas fa-ghost bounce"></i> superChat</div><br/>
            <span>&gt;</span> Made with 💖 + 🔥Firebase...
          </div>
          <div className='home-section-2'>
            <div className='home-seaction-2-row'><span>F</span><p>uses 🔥<span>F</span>irebase</p></div>
            <div className='home-seaction-2-row'><span>E</span><p><span>E</span>asy to use😃</p></div>
            <div className='home-seaction-2-row'><span>A</span><p><span>A</span>vailable on all platform🌐</p></div>
            <div className='home-seaction-2-row'><span>T</span><p>realtime <span>T</span>exting💬</p></div>
            <div className='home-seaction-2-row'><span>U</span><p><span>U</span>nique🌟 design</p></div>
            <div className='home-seaction-2-row'><span>R</span><p><span>R</span>esponsive across devices📱💻</p></div>
            <div className='home-seaction-2-row'><span>E</span><p><span></span></p></div>
            <div className='home-seaction-2-row'><span>S</span><p>data <span>S</span>ecured using firebase🔒</p></div>
          </div>
        </section>
        <section className='footer-container'>
          
          <Social />
        </section>

      </>
    )
  }




  return (
    <>

      <div className='container'>
        <Nav />
        {currUser ? <Chat /> : <Home />}
      </div>

    </>
  );
}

export default App;



