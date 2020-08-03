const BudgetController = (() => {})();

const UIController = (() => {
  const DOMstrings = {
    totalBudget: '.budget__value',
    income: '.budget__income--value',
    expense: '.budget__expenses--value',
  };

  return {
    DOMstrings,
  };
})();

const Controller = ((UIctrl) => {})(UIController);
