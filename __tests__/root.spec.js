import { createRulebooks } from "../scripts/createRulebooks";

//const pdfMaker = jest.mock('html-pdf-chrome"');

const options = {
  debug: false,
  printOptions: {
    displayHeaderFooter: false,
  },
};

describe("Root", () => {
	describe("should just pass", () => {
		it("because it is true", () => {
      createRulebooks('medic', options)
			expect(git status).toHaveBeenCalled(true);
		});
	});
});