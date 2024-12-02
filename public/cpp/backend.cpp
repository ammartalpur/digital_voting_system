#include <iostream>
#include <string>
#include <emscripten/emscripten.h>

using namespace std;

string admin_username = "a";
string admin_password = "ab12";

extern "C"
{
  EMSCRIPTEN_KEEPALIVE
  int account_verify(const char *username, const char *password)
  {
    cout << "Username: " << username << " Password: " << password << endl;
    return (username == admin_username && password == admin_password) ? 1 : 0;
  }
}