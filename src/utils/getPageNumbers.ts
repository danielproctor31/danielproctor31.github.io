import { SITE } from "@config";

const getPageNumbers = (numberOfPosts: number) => {
  const numberOfPages = numberOfPosts / Number(SITE.postPerPage);

  let pageNumbers: string[] = [];
  for (let i = 1; i <= Math.ceil(numberOfPages); i++) {
    pageNumbers = [...pageNumbers, String(i)];
  }

  return pageNumbers;
};

export default getPageNumbers;
