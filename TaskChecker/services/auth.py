from typing import Optional, Any, Union

import requests
from requests.cookies import RequestsCookieJar

from common import FromClassToDict, MetaSingleton
from config_loader import ConfigLoader

config = ConfigLoader()


class AuthRequest(metaclass=MetaSingleton):
    def __init__(self):
        self.access_token: Optional[str] = None
        self.token_type: Optional[str] = None
        self.cookies: Optional[RequestsCookieJar] = None
        self.base_url = config.BACKEND_URL

        self.authorize()

    def authorize(self):
        req = requests.post(f"{self.base_url}/token",
                            data={"username": config.TASK_CHECKER_USERNAME,
                                  "password": config.TASK_CHECKER_PASSWORD})
        self.access_token = req.json().get("access_token")
        self.cookies = req.cookies
        self.token_type = req.json().get("token_type")

    def reauthorize(self):
        req = requests.get(f"{self.base_url}/auth/refresh_token", cookies=self.cookies)
        self.access_token = req.json().get("access_token")
        self.cookies = req.cookies

    def __call__(self,
                 method: Union[str, bytes],
                 url: Union[str, bytes],
                 *args,
                 **kwargs):
        headers = kwargs.get("headers")
        auth_header = {"Authorization": f"{self.token_type} {self.access_token}"}
        if headers:
            headers.update(auth_header)
        else:
            kwargs["headers"] = auth_header

        kwargs["cookies"] = self.cookies

        # TODO: rework to reauthorize when access_token expire
        return requests.request(method,
                                f"{self.base_url}{url if url.startswith('/') else f'/{url}'}",
                                *args,
                                **kwargs)


if __name__ == "__main__":
    request = AuthRequest()
    req = request("get", "/user/get_data")
    print(req.json())
