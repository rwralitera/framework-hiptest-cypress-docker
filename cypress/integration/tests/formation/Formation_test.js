describe('Formation', function () {
  beforeEach(function () {
    this.actionwords = Object.create(require('../../actionwords.js').Actionwords);
  });

  it('Formation (uid:ba4f120b-a9b9-49b3-ba98-f2fd9bc50ab6)', function () {
    // Navigate to Google page
    // Given I navigate to "http://www.google.com/"
    this.actionwords.iNavigateToP1("http://www.google.com/");
  });
});
