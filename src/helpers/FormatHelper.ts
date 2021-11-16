const capitalize = (string: string): string => {
  const arr = string ? string.split(" ") : null;
  //loop through each element of the array and capitalize the first letter.

  if (arr && arr.length) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    //Join all the elements of the array back into a string
    //using a blankspace as a separator
    const str2 = arr.join(" ");
    return str2;
  } else {
    return "";
  }
};

export default capitalize;
