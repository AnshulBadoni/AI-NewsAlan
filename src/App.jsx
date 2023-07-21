import { useState,useEffect } from "react";
import alanBtn from '@alan-ai/alan-sdk-web';
import NewsCards from "./components/NewsCards/NewsCards";
import useStyles from './styles.js';

const alanKey = '8a0a83c59cc0021689a5185f33a3bbec2e956eca572e1d8b807a3e2338fdd0dc/stage'

function App() {
  const [news, setNews] = useState([]);
  const classes = useStyles();
  useEffect(()=>{
    alanBtn({
        key: alanKey,
        onCommand: ( {command,articles} ) => {
          if(command==='newHeadlines'){
            setNews(articles);
          }
        }
    })
  },[])
  return (
    <div> 
      <div className={classes.logoContainer}>
        <img className={classes.alanLogo} src="https://tse1.mm.bing.net/th?id=OIP.CJyCnZVdr-EfgC27MAdFUQHaE8&pid=ImgDet&rs=1" alt="" />
      </div>
    <NewsCards articles={news}/>
    </div>
  )
}

export default App

