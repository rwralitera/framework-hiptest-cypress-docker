describe('Formation', function () {
  beforeEach(function () {
    this.actionwords = Object.create(require('../../actionwords.js').Actionwords);
  });

  it('Formation', function () {
    // Navigate to Google page
    // Given I navigate to "http://www.google.com/"
    this.actionwords.iNavigateToP1("http://www.google.com/");
  });
});
