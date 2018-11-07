const { default: initStoryshots, multiSnapshotWithOptions } = require('@storybook/addon-storyshots');
const { render } = require('enzyme');

beforeEach(() => {
  Date.now = jest.fn(() => 1541586333599);
});

initStoryshots();
/*
{
  renderer: render,
  test: multiSnapshotWithOptions({
    // https://github.com/storybooks/storybook/tree/master/addons/storyshots#using-createnodemock-to-mock-refs
    // https://reactjs.org/blog/2016/11/16/react-v15.4.0.html#mocking-refs-for-snapshot-testing
    createNodeMock: element => {
      if (element.type === 'div') {
        return document.createElement('div');
      }

      if (element.type === 'input') {
        return document.createElement('input');
      }

      if (element.type === 'textarea') {
        return document.createElement('textarea');
      }
    },
  }),
});
*/
