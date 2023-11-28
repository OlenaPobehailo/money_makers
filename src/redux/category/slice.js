const { createSlice, isAnyOf } = require('@reduxjs/toolkit');
const { addedCategoryThunk, deleteCategoryThunk, updateCategoryThunk, fetchCategoriesThunk } = require('./operations');

const initialState = {
  categories: {
    incomes: [],
    expenses: [],
  },
  error: null,
  isLoading: false,
};

const slice = createSlice({
  name: 'categories',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(addedCategoryThunk.fulfilled, (state, { payload }) => {
        if (payload.type === 'incomes') {
          state.categories.incomes.push(payload);
        } else {
          state.categories.expenses.push(payload);
        }
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, { payload }) => {
        if (payload.type === 'incomes') {
          state.categories.incomes = state.categories.incomes.filter(category => category.id !== payload.id);
        } else {
          state.categories.expenses = state.categories.expenses.filter(category => category.id !== payload.id);
        }
      })
      .addCase(updateCategoryThunk.fulfilled, (state, { payload }) => {
        const { _id, categoryName } = payload;

        const editCategoryIncomes = state.categories.incomes.find(category => category._id === _id);
        const editCategoryExpenses = state.categories.expenses.find(category => category._id === _id);

        if (editCategoryIncomes) {
          editCategoryIncomes.categoryName = categoryName;
        } else if (editCategoryExpenses) {
          editCategoryExpenses.categoryName = categoryName;
        }
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, { payload }) => {
        state.categories = payload;
      })
      .addMatcher(
        isAnyOf(
          addedCategoryThunk.pending,
          deleteCategoryThunk.pending,
          updateCategoryThunk.pending,
          fetchCategoriesThunk.pending
        ),
        (state, _) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          addedCategoryThunk.rejected,
          deleteCategoryThunk.rejected,
          updateCategoryThunk.rejected,
          fetchCategoriesThunk.rejected
        ),
        (state, { payload }) => {
          state.isLoading = false;
          state.error = payload;
        }
      )
      .addMatcher(
        isAnyOf(
          addedCategoryThunk.fulfilled,
          deleteCategoryThunk.fulfilled,
          updateCategoryThunk.fulfilled,
          fetchCategoriesThunk.fulfilled
        ),
        (state, _) => {
          state.isLoading = false;
          state.error = null;
        }
      );
  },
});

export const categoriesReducer = slice.reducer;
