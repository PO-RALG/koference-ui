export const TREE_NODE = {
  id: 1,
  name: "Applications :",
  code: "001",
  children: [
    { id: 2, name: "Calendar : app", code: "002" },
    { id: 3, name: "Chrome : app", code: "003" },
    { id: 4, name: "Webstorm : app", code: "004" },
    {
      id: 5,
      name: "Documents :",
      code: "005",
      children: [
        {
          id: 6,
          name: "vuetify :",
          code: "006",
          children: [
            {
              id: 7,
              name: "src :",
              code: "007",
              children: [
                { id: 8, name: "index : ts", code: "008" },
                { id: 9, name: "bootstrap : ts", code: "009" },
              ],
            },
          ],
        },
        {
          id: 10,
          name: "material2 :",
          code: "010",
          children: [
            {
              id: 11,
              name: "src :",
              code: "011",
              children: [
                { id: 12, name: "v-btn : ts", code: "012" },
                { id: 13, name: "v-card : ts", code: "013" },
                { id: 14, name: "v-window : ts", code: "014" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 15,
      name: "Downloads :",
      code: "015",
      children: [
        { id: 16, name: "October : pdf", code: "016" },
        { id: 17, name: "November : pdf", code: "017" },
        { id: 18, name: "Tutorial : html", code: "018" },
      ],
    },
    {
      id: 19,
      name: "Videos :",
      code: "019",
      children: [
        {
          id: 20,
          name: "Tutorials :",
          code: "020",
          children: [
            { id: 21, name: "Basic layouts : mp4", code: "021" },
            { id: 22, name: "Advanced techniques : mp4", code: "022" },
            { id: 23, name: "All about app : dir", code: "023" },
          ],
        },
        { id: 24, name: "Intro : mov", code: "024" },
        { id: 25, name: "Conference introduction : avi", code: "025" },
      ],
    },
  ],
};
