const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  ASK_QUESTION: "/ask-question",
  COLLECTION: "/collection",
  COMMUNITY: "/community",
QUESTION: (id: string) => `/questions/${id}`,
  QUESTION_DETAILS: (questionId: string) => `/questions/${questionId}`,
  QUESTIONS: (id: string) => `/questions/${id}`,
  PROFILE: (id: string) => `/profile/${id}`,
  TAGS: "/tags",
  TAG: (id: string) => `/tags/${id}`,
  EDIT_QUESTION: (id: string) => `/questions/${id}/edit`,
  SIGN_IN_WITH_OAUTH: "signin-oauth",
};

export default ROUTES;
