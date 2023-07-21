
intent('what is this app?','what should I do Here?',
       reply('This is news project, you can ask me what the latest news.'));
 

const API_KEY = 'your api key';
let savedArticles = [];

intent(`Give me the news from $(source* (.*))`, (p) => {
    let news_api_url = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}`;

    if (p.source.value) {
        news_api_url = `${news_api_url}&sources=${p.source.value.toLowerCase().split(" ").join('-')}`
    }

    api.request(news_api_url, (error, response, body) => {
        if (error) {
            console.error('Error fetching news:', error);
            p.play('Sorry, there was an error fetching the news. Please try again later.');
            return;
        }

        try {
            const { articles } = JSON.parse(body);

            if (!articles || !Array.isArray(articles) || articles.length === 0) {
                p.play('Sorry, there are no articles available from the specified source.');
                return;
            }

            savedArticles = articles;
            p.play({ command: 'newHeadlines', articles });
            p.play(`Here are the (latest|recent) ${p.source.value} reports.`);
        } catch (parseError) {
            console.error('Error parsing API response:', parseError);
            p.play('Sorry, there was an error processing the news data. Please try again later.');
        }
    });
});


intent(`What\'s Up with $(term* (.*))`, (p) => {
    let news_api_url = `https://newsapi.org/v2/everything?apiKey=${API_KEY}`;

    if (p.term.value) {
        news_api_url = `${news_api_url}&q=${p.term.value}`
    }

    api.request(news_api_url, (error, response, body) => {
        if (error) {
            console.error('Error fetching news:', error);
            p.play('Sorry, there was an error fetching the news. Please try again later.');
            return;
        }

        try {
            const { articles } = JSON.parse(body);

            if (!articles || !Array.isArray(articles) || articles.length === 0) {
                p.play(`Sorry, there are no data on ${p.term.value}. Please search something diffrent`);
                return;
            }

            savedArticles = articles;
            p.play({ command: 'newHeadlines', articles });
            p.play(`Here are the (latest|recent) on ${p.term.value}.`);
        } catch (parseError) {
            console.error('Error parsing API response:', parseError);
            p.play('Sorry, there was an error processing the news data. Please try again later.');
        }
    });
});
const CATEGORIES = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
const CATEGORIES_INTENT = `${CATEGORIES.map((category) => `${category}~${category}`).join('|')}|`;

intent(`(show|what is|tell me|what's|what are|what're|read) (the|) (recent|latest|) $(N news|headlines) (in|about|on|) $(C~ ${CATEGORIES_INTENT})`,
  `(read|show|get|bring me|give me) (the|) (recent|latest) $(C~ ${CATEGORIES_INTENT}) $(N news|headlines)`, (p) => {
    let news_api_url = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}&country=us`;
    
    if(p.C.value) {
        news_api_url = `${news_api_url}&category=${p.C.value}`
    }
    
    api.request(news_api_url, (error, response, body) => {
        const { articles } = JSON.parse(body);
        
        if(!articles.length) {
            p.play('Sorry, please try searching for a different category.');
            return;
        }
        
        savedArticles = articles;
        
        p.play({ command: 'newHeadlines', articles });
        
        if(p.C.value) {
            p.play(`Here are the (latest|recent) articles on ${p.C.value}.`);        
        } else {
            p.play(`Here are the (latest|recent) news`);   
        }
        
        p.play('Would you like me to read the headlines?');
        p.then(confirmation);
    });
});

const confirmation = context(() => {
    intent('yes', async (p) => {
        for(let i = 0; i < savedArticles.length; i++){
            p.play({ command: 'highlight', article: savedArticles[i]});
            p.play(`${savedArticles[i].title}`);
        }
    })
    
    intent('no', (p) => {
        p.play('Sure, sounds good to me.')
    })
})

intent('open (the|) (article|) (number|) $(number* (.*))', (p) => {
    if(p.number.value) {
        p.play({ command:'open', number: p.number.value, articles: savedArticles})
    }
})

intent('(go|) back', (p) => {
    p.play('Sure, going back');
    p.play({ command: 'newHeadlines', articles: []})
})


