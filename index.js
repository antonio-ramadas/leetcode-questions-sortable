const fs = require('fs');
const Handlebars = require('handlebars');
const axios = require('axios');

const template = Handlebars.compile(fs.readFileSync('./index.handlebars.html', {encoding: 'utf8'}));

const graphQlQuery = `
            query problemsetQuestionList(
              $categorySlug: String
              $limit: Int
              $skip: Int
              $filters: QuestionListFilterInput
            ) {
              problemsetQuestionList: questionList(
                categorySlug: $categorySlug
                limit: $limit
                skip: $skip
                filters: $filters
              ) {
                total: totalNum
                questions: data {
                  premium: isPaidOnly
                  questionId: questionFrontendId
                  title
                  titleSlug
                  likes
                  dislikes
                  status
                }
              }
            }`;

const data = JSON.stringify({
    "query": graphQlQuery,
    "variables": {
        "categorySlug": "",
        "skip": 0,
        "limit": 5000,
        "filters": {}
    },
    "operationName": "problemsetQuestionList"
});

const config = {
    method: 'post',
    url: 'https://leetcode.com/graphql/',
    headers: {
        'content-type': 'application/json'
    },
    data: data
};

if (process.argv[2]) {
    const leetCodeSession = process.argv[2];
    console.debug(`Setting cookie: '${leetCodeSession}'`);
    config.headers['Cookie'] = `LEETCODE_SESSION=${leetCodeSession}`;
}

axios(config)
    .then(function (response) {
        const time = new Date().toLocaleString('en-US', {
            hourCycle: 'h24', hour: 'numeric', minute: 'numeric', second: 'numeric',
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            timeZone: 'UTC', timeZoneName: 'short'
        });

        const total = response.data.data.problemsetQuestionList.total;

        const questions = response.data.data.problemsetQuestionList.questions
            .map(el => {
                return {
                    ...el,
                    done: el.status === 'ac',
                    likesRatio: el.likes / el.dislikes,
                    url: `https://leetcode.com/problems/${el.titleSlug}`,
                }
            });

        fs.writeFileSync('./resources/index.html', template({time: time, total: total, questions: questions}));
    })
    .catch(function (error) {
        console.log(error);
    });
