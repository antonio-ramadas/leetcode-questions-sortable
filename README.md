# LeetCode Questions Sortable

Out of frustration by not being able to sort questions by the number of likes, I [created a small website](https://antonio-ramadas.github.io/leetcode-questions-sortable/) that acts as a complement to the [official LeetCode website](https://leetcode.com/).

To install the required dependencies, you just need `npm install`. To generate the website `npm run build`. The generated HTML file will be in the [`public` directory](public). The project relies on Handlebars and only needs 100 lines of code logic.

You may notice that the status of the problems is not marked as done (`✅`) despite you having completed them. In order to correctly display the status, you need to pass as argument the `LEETCODE_SESSION` cookie (e.g., `npm run build my-very-long-leetcode-session-cookie`).
