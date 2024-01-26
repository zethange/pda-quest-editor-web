export function storiesReducer() {
  // switch (action.type) {
  //   case "added": {
  //     return [
  //       ...stories,
  //       {
  //         id: action.id,
  //         text: action.text,
  //         done: false,
  //       },
  //     ];
  //   }
  //   case "changed": {
  //     return stories.map((t) => {
  //       if (t.id === action.task.id) {
  //         return action.task;
  //       } else {
  //         return t;
  //       }
  //     });
  //   }
  //   case "deleted": {
  //     return stories.filter((t) => t.id !== action.id);
  //   }
  //   default: {
  //     throw Error("Unknown action: " + action.type);
  //   }
  // }
}
