describe('Manager scan flag', function () {
  beforeEach(function () {
    this.actionwords = Object.create(require('../../actionwords.js').Actionwords);
  });

  describe('Manager scan flag', function () {
    function managerScanFlag (user) {
      // Given The user is logged in as "<USER>"
      this.actionwords.theUserIsLoggedInAsP1(user);
      // And The user is on "Reports" section of "requests" page for "RETRAITE AU PETIT GARDONNE" company
      this.actionwords.theUserIsOnP1SectionOfP2PageForP3Company("Reports", "requests", "RETRAITE AU PETIT GARDONNE");
      // When The user clicks on "Manager X-Ray" link
      this.actionwords.theUserClicksOnP1Link("Manager X-Ray");
      // Then The user shouls see a flag with color "yellow"
      this.actionwords.theUserShoulsSeeAFlagWithColorP1("yellow");
    }

    it('Team member', function () {
      managerScanFlag.apply(this, ['AdminUser']);
    });

    it('Bank user', function () {
      managerScanFlag.apply(this, ['BankUser']);
    });
  });
});
