# Contributing to Stock Dashboard Frontend

Thank you for your interest in contributing to our project! We welcome all contributions, big or small. By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Development Setup Guide & Getting Started

This section outlines the process to set up your local environment and begin contributing.

1.  **Fork the repository:** Click the "Fork" button on the top right of this page.
2.  **Clone your fork:**
    ```bash
    git clone [https://github.com/your-username/stock-dashboard.git](https://github.com/your-username/stock-dashboard.git)
    cd stock-dashboard/frontend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the application:** Start the local development server:
    ```bash
    npm run dev
    ```
5.  The application should now be available at `http://localhost:3000` (or the port specified).
6.  **Create a new branch:** Always work on a new branch for your feature or fix.
    ```bash
    git checkout -b feature/your-feature-name-or-issue-number
    ```

## Commit Message Conventions

We **require** the use of **Conventional Commits** to maintain a clean, organized project history and facilitate automated release notes.

**General Format:** `<type>(<scope>): <short description>`

| Type           | Purpose                                                            | Example                                                |
| :------------- | :----------------------------------------------------------------- | :----------------------------------------------------- |
| **`feat`**     | A new feature.                                                     | `feat(chart): implement candlestick chart view`        |
| **`fix`**      | A bug fix.                                                         | `fix(layout): fix sidebar collapse issue on mobile`    |
| **`docs`**     | Documentation changes only.                                        | `docs: update CONTRIBUTING.md`                         |
| **`refactor`** | Code restructuring that doesn't fix a bug or add a feature.        | `refactor(auth): rename login service to auth service` |
| **`test`**     | Adding or correcting tests.                                        | `test: add unit test for StockCard component`          |
| **`chore`**    | Changes to the build process, package manager, or auxiliary tools. | `chore: update webpack configuration`                  |

---

## Code Style Guidelines

To ensure consistency and readability, please adhere to the following style guidelines. We enforce these using **ESLint** and **Prettier**.

- **Indentation:** Use **2 spaces** for indentation.
- **Naming Conventions:** Variables, functions, and files should use **camelCase**. React components and classes must use **PascalCase** (e.g., `StockCard.jsx`).
- **Structure:**
  - New components should be placed in `src/components/` and should follow the existing structure (preferably one component per folder).
- **Comments:** Ensure your code is well-commented where necessary, especially for complex logic.

---

## Testing Guidelines

We use **Jest** and **React Testing Library** for testing.

1.  **Coverage:** All new features (`feat`) and bug fixes (`fix`) **must** be accompanied by relevant unit or integration tests to prevent regressions.
2.  **Running Tests:** Before submitting a Pull Request, verify all local tests pass:
    ```bash
    npm test
    ```

## Code Review Process

1.  **Submission:** After pushing your changes, open a Pull Request (PR). **Ensure you use the provided PR Template.**
2.  **Review:** A project **Maintainer** will review your PR, focusing on code quality, adherence to style guides, and test coverage.
3.  **Iteration:** Reviewers may leave comments requesting changes. Please address all feedback by making further commits to the same branch or providing a clear explanation.
4.  **Merge:** Your PR will be merged only after receiving at least **one approval** from a Maintainer and all automated checks pass.

---

## Submitting a Pull Request & Finding a Task

### How to Find a Task

We've tagged issues that are great for first-time contributors with the label `good first issue`. Look for these issues on our [Issues page](https://github.com/your-username/your-repo/issues).

### Submitting a Pull Request (PR)

When you submit your pull request, please ensure it meets the following criteria and **fill out the provided template:**

- It's a single, focused change.
- The changes are well-documented (in the code and the PR description).
- The pull request title and description are clear and concise.
- It passes our automated checks (CI/CD).
- **Commit your changes:**
  ```bash
  git add .
  git commit -m "feat(scope): your commit message"
  ```
- **Push your changes to your fork:**
  ```bash
  git push origin feature/your-feature-name-or-issue-number
  ```

### Making an Issue

Please use the appropriate template when creating a new issue:

- Use `bug_report.md` for reporting problems.
- Use `feature_request.md` for suggesting new ideas.

Thank you for helping us make this project better!
