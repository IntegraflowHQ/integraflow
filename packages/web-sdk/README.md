# Integraflow Web SDK

[![npm package](https://img.shields.io/npm/v/@integraflow/web?style=flat-square)](https://www.npmjs.com/package/@integraflow/web)
[![MIT License](https://img.shields.io/badge/License-MIT-red.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Integraflow provides tools to redefine customer experience with organic feedback and behavioural data in real-time. Enjoy intuitive designs, open source surveys, advanced analytics, seamless collaboration on the go.

## Get Started with CDN

Start by adding the following snippet to your website:

```html
<script>
  (function(w,p){w[p]=w[p]||function(){w[p].q=w[p].q||[];w[p].q.push(arguments)}})(window,"Integraflow");

  Integraflow('init', {
    surveys: [],
    debug: true,
    onAudienceChanged(audience) {
      // ...
    },
    onEventTracked(payload) {
      // ...
    },
    onSurveyDisplayed(surveyId) {
      // ...
    },
    onQuestionAnswered(surveyId, questionId, answers) {
      // ...
    },
    onSurveyCompleted(surveyId) {
      // ...
    },
    onSurveyClosed(surveyId) {
      // ...
    },
  });
</script>
<script src="https://unpkg.com/@integraflow/web/dist/web-bundle.js" async></script>
```

For more information on integrating the Web SDK with your project, please see the [Integraflow developer guide](https://docs.useintegraflow.com).

## Get Started with NPM

Start by adding the package dependency to your project:

```
npm install --save @integraflow/web
```

After installation, import and initialize the SDK in your application code:

```javascript
import Integraflow from '@integraflow/web';

const integraflowClient = Integraflow.init({
  surveys: [],
  debug: true,
  onAudienceChanged(audience) {
    // ...
  },
  onEventTracked(payload) {
    // ...
  },
  onSurveyDisplayed(surveyId) {
    // ...
  },
  onQuestionAnswered(surveyId, questionId, answers) {
    // ...
  },
  onSurveyCompleted(surveyId) {
    // ...
  },
  onSurveyClosed(surveyId) {
    // ...
  },
});
```

For more information on integrating the Web SDK with your project, please see the [Integraflow developer guide](https://docs.useintegraflow.com).

## Contributing

Pull requests are welcome for any improvements you might wish to make. If it's something big and you're not sure about it yet, we'd be happy to discuss it first. You can either file an issue or drop us a line to [dev@useintegraflow.com](mailto:dev@useintegraflow.com).

To get started with development, simply clone this repo and open the project to kick things off.

## License

This project is licensed under the MIT license. See our LICENSE file and individual source files for more information.
