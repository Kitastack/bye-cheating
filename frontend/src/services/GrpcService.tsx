interface IGrpcService {
  login(email: string, password: string): string | null | undefined;
  logout(): void;

  // authenticated user only
  changeCamChannel(id: string): void;
  
  adminAddCamera(name: string, url: string): void;
  adminEditCamera(id: string, name?: string, url?: string):void
  
  adminAddUser(
    email: string,
    name: string,
    password: string
  ): string | null | undefined;
  adminEditUser(
    id: string,
    email?: string,
    name?: string,
    password?: string
  ): string | null | undefined;

  adminDeleteUser(id: string, email: string): void;
}

class GrpcServices {
  constructor() {}
}
