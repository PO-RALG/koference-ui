export interface Loading {
  loading: boolean;
  requestsPending: number;
}

export interface Drawer {
  isOpen: boolean;
}

interface LoginStatus {
  isLoggedIn: boolean;
}

interface App {
  name: string;
}

export interface Auth {
  currentUser: Record<string, unknown>;
  loginError: Record<string, unknown>;
  app: App;
  loginStatus: LoginStatus;
}

export interface ChangePassword {
  show: boolean;
  message: string;
  requestsPending: number;
}

export interface LoginDialog {
  show: boolean;
  message: string;
  requestsPending: number;
}

export interface SnackBar {
  show: boolean;
  message: Record<string, unknown>;
  requestsPending: number;
}
