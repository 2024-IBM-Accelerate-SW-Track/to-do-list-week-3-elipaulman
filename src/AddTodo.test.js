import { render, screen, fireEvent} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

 test('test that App component can be deleted thru checkbox', () => {
  render(<App />);
 });


 test('test that App component renders different colors for past due events', () => {
  render(<App />);
 });

test('test that App component does not render duplicate tasks', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /Add/i });
  const taskName = "History Test";
  const dueDate = "05/30/2023";

  // Add the task twice
  fireEvent.change(inputTask, { target: { value: taskName }});
  fireEvent.change(inputDate, { target: { value: dueDate }});
  fireEvent.click(addButton);
  fireEvent.change(inputTask, { target: { value: taskName }});
  fireEvent.change(inputDate, { target: { value: dueDate }});
  fireEvent.click(addButton);

  // Check that only one task is present
  const tasks = screen.getAllByText(new RegExp(taskName, "i"));
  expect(tasks.length).toBe(1);
});

test('test that App component does not add a task without task name', () => {
  render(<App />);
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /Add/i });
  const dueDate = "05/30/2023";

  // Try to add a task without a name
  fireEvent.change(inputDate, { target: { value: dueDate }});
  fireEvent.click(addButton);

  // Check that no tasks were added
  const tasks = screen.queryAllByTestId(/task/i);
  expect(tasks.length).toBe(0);
});

test('test that App component does not add a task without due date', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const addButton = screen.getByRole('button', { name: /Add/i });
  const taskName = "History Test";

  // Try to add a task without a due date
  fireEvent.change(inputTask, { target: { value: taskName }});
  fireEvent.click(addButton);

  // Check that no tasks were added
  const tasks = screen.queryAllByTestId(/task/i);
  expect(tasks.length).toBe(0);
});

test('test that App component renders different colors for past due tasks', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /Add/i });
  const taskName = "History Test";
  const dueDate = "05/30/2020"; // Past due date

  // Add a past due task
  fireEvent.change(inputTask, { target: { value: taskName }});
  fireEvent.change(inputDate, { target: { value: dueDate }});
  fireEvent.click(addButton);

  // Check that the task has a different color
  const task = screen.getByText(new RegExp(taskName, "i"));
  expect(task.style.color).not.toBe("black"); // Assuming black is the default color
});

test('test that App component can delete tasks through checkbox', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /Add/i });
  const taskName = "History Test";
  const dueDate = "05/30/2023";

  // Add a task
  fireEvent.change(inputTask, { target: { value: taskName }});
  fireEvent.change(inputDate, { target: { value: dueDate }});
  fireEvent.click(addButton);

  // Check that the task was added
  const task = screen.getByText(new RegExp(taskName, "i"));

  // Delete the task
  const deleteCheckbox = screen.getByTestId('delete-checkbox');
  fireEvent.click(deleteCheckbox);

  // Check that the task was deleted
  const deletedTask = screen.queryByText(new RegExp(taskName, "i"));
  expect(deletedTask).not.toBeInTheDocument();
});
