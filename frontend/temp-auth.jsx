import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=bfccfb8b"; const createContext = __vite__cjsImport0_react["createContext"]; const useContext = __vite__cjsImport0_react["useContext"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useMemo = __vite__cjsImport0_react["useMemo"]; const useState = __vite__cjsImport0_react["useState"];
import { api } from "/src/services/api.js";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("aquafarm_user") || "null"));
  const [loading, setLoading] = useState(false);
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("aquafarm_token", data.token);
      localStorage.setItem("aquafarm_user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };
  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      localStorage.setItem("aquafarm_token", data.token);
      localStorage.setItem("aquafarm_user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    localStorage.removeItem("aquafarm_token");
    localStorage.removeItem("aquafarm_user");
    setUser(null);
  };
  useEffect(() => {
    if (localStorage.getItem("aquafarm_token")) api.get("/auth/me").then(({ data }) => {
      setUser(data.user);
      localStorage.setItem("aquafarm_user", JSON.stringify(data.user));
    }).catch(() => logout());
  }, []);
  const value = useMemo(() => ({ user, login, register, logout, loading, isAuthed: !!user }), [user, loading]);
  return /* @__PURE__ */ React.createElement(AuthContext.Provider, { value }, children);
}
export const useAuth = () => useContext(AuthContext);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1dGhDb250ZXh0LmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgYXBpIH0gZnJvbSAnLi4vc2VydmljZXMvYXBpJztcbmNvbnN0IEF1dGhDb250ZXh0ID0gY3JlYXRlQ29udGV4dChudWxsKTtcbmV4cG9ydCBmdW5jdGlvbiBBdXRoUHJvdmlkZXIoe2NoaWxkcmVufSl7Y29uc3QgW3VzZXIsc2V0VXNlcl09dXNlU3RhdGUoKCk9PkpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FxdWFmYXJtX3VzZXInKXx8J251bGwnKSk7IGNvbnN0IFtsb2FkaW5nLHNldExvYWRpbmddPXVzZVN0YXRlKGZhbHNlKTtcbiBjb25zdCBsb2dpbj1hc3luYyhlbWFpbCxwYXNzd29yZCk9PntzZXRMb2FkaW5nKHRydWUpOyB0cnl7Y29uc3Qge2RhdGF9PWF3YWl0IGFwaS5wb3N0KCcvYXV0aC9sb2dpbicse2VtYWlsLHBhc3N3b3JkfSk7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdhcXVhZmFybV90b2tlbicsZGF0YS50b2tlbik7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdhcXVhZmFybV91c2VyJyxKU09OLnN0cmluZ2lmeShkYXRhLnVzZXIpKTsgc2V0VXNlcihkYXRhLnVzZXIpOyByZXR1cm4gZGF0YS51c2VyO31maW5hbGx5e3NldExvYWRpbmcoZmFsc2UpfX07XG4gY29uc3QgcmVnaXN0ZXI9YXN5bmMocGF5bG9hZCk9PntzZXRMb2FkaW5nKHRydWUpOyB0cnl7Y29uc3Qge2RhdGF9PWF3YWl0IGFwaS5wb3N0KCcvYXV0aC9yZWdpc3RlcicscGF5bG9hZCk7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdhcXVhZmFybV90b2tlbicsZGF0YS50b2tlbik7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdhcXVhZmFybV91c2VyJyxKU09OLnN0cmluZ2lmeShkYXRhLnVzZXIpKTsgc2V0VXNlcihkYXRhLnVzZXIpOyByZXR1cm4gZGF0YS51c2VyO31maW5hbGx5e3NldExvYWRpbmcoZmFsc2UpfX07XG4gY29uc3QgbG9nb3V0PSgpPT57bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2FxdWFmYXJtX3Rva2VuJyk7bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2FxdWFmYXJtX3VzZXInKTtzZXRVc2VyKG51bGwpfTtcbiB1c2VFZmZlY3QoKCk9PntpZihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYXF1YWZhcm1fdG9rZW4nKSkgYXBpLmdldCgnL2F1dGgvbWUnKS50aGVuKCh7ZGF0YX0pPT57c2V0VXNlcihkYXRhLnVzZXIpO2xvY2FsU3RvcmFnZS5zZXRJdGVtKCdhcXVhZmFybV91c2VyJyxKU09OLnN0cmluZ2lmeShkYXRhLnVzZXIpKX0pLmNhdGNoKCgpPT5sb2dvdXQoKSl9LFtdKTtcbiBjb25zdCB2YWx1ZT11c2VNZW1vKCgpPT4oe3VzZXIsbG9naW4scmVnaXN0ZXIsbG9nb3V0LGxvYWRpbmcsaXNBdXRoZWQ6ISF1c2VyfSksW3VzZXIsbG9hZGluZ10pOyByZXR1cm4gPEF1dGhDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0+e2NoaWxkcmVufTwvQXV0aENvbnRleHQuUHJvdmlkZXI+fVxuZXhwb3J0IGNvbnN0IHVzZUF1dGg9KCk9PnVzZUNvbnRleHQoQXV0aENvbnRleHQpO1xuIl0sIm1hcHBpbmdzIjoiQUFBQSxTQUFTLGVBQWUsWUFBWSxXQUFXLFNBQVMsZ0JBQWdCO0FBQ3hFLFNBQVMsV0FBVztBQUNwQixNQUFNLGNBQWMsY0FBYyxJQUFJO0FBQy9CLGdCQUFTLGFBQWEsRUFBQyxTQUFRLEdBQUU7QUFBQyxRQUFNLENBQUMsTUFBSyxPQUFPLElBQUUsU0FBUyxNQUFJLEtBQUssTUFBTSxhQUFhLFFBQVEsZUFBZSxLQUFHLE1BQU0sQ0FBQztBQUFHLFFBQU0sQ0FBQyxTQUFRLFVBQVUsSUFBRSxTQUFTLEtBQUs7QUFDL0ssUUFBTSxRQUFNLE9BQU0sT0FBTSxhQUFXO0FBQUMsZUFBVyxJQUFJO0FBQUcsUUFBRztBQUFDLFlBQU0sRUFBQyxLQUFJLElBQUUsTUFBTSxJQUFJLEtBQUssZUFBYyxFQUFDLE9BQU0sU0FBUSxDQUFDO0FBQUcsbUJBQWEsUUFBUSxrQkFBaUIsS0FBSyxLQUFLO0FBQUcsbUJBQWEsUUFBUSxpQkFBZ0IsS0FBSyxVQUFVLEtBQUssSUFBSSxDQUFDO0FBQUcsY0FBUSxLQUFLLElBQUk7QUFBRyxhQUFPLEtBQUs7QUFBQSxJQUFLLFVBQUM7QUFBUSxpQkFBVyxLQUFLO0FBQUEsSUFBQztBQUFBLEVBQUM7QUFDM1MsUUFBTSxXQUFTLE9BQU0sWUFBVTtBQUFDLGVBQVcsSUFBSTtBQUFHLFFBQUc7QUFBQyxZQUFNLEVBQUMsS0FBSSxJQUFFLE1BQU0sSUFBSSxLQUFLLGtCQUFpQixPQUFPO0FBQUcsbUJBQWEsUUFBUSxrQkFBaUIsS0FBSyxLQUFLO0FBQUcsbUJBQWEsUUFBUSxpQkFBZ0IsS0FBSyxVQUFVLEtBQUssSUFBSSxDQUFDO0FBQUcsY0FBUSxLQUFLLElBQUk7QUFBRyxhQUFPLEtBQUs7QUFBQSxJQUFLLFVBQUM7QUFBUSxpQkFBVyxLQUFLO0FBQUEsSUFBQztBQUFBLEVBQUM7QUFDalMsUUFBTSxTQUFPLE1BQUk7QUFBQyxpQkFBYSxXQUFXLGdCQUFnQjtBQUFFLGlCQUFhLFdBQVcsZUFBZTtBQUFFLFlBQVEsSUFBSTtBQUFBLEVBQUM7QUFDbEgsWUFBVSxNQUFJO0FBQUMsUUFBRyxhQUFhLFFBQVEsZ0JBQWdCLEVBQUcsS0FBSSxJQUFJLFVBQVUsRUFBRSxLQUFLLENBQUMsRUFBQyxLQUFJLE1BQUk7QUFBQyxjQUFRLEtBQUssSUFBSTtBQUFFLG1CQUFhLFFBQVEsaUJBQWdCLEtBQUssVUFBVSxLQUFLLElBQUksQ0FBQztBQUFBLElBQUMsQ0FBQyxFQUFFLE1BQU0sTUFBSSxPQUFPLENBQUM7QUFBQSxFQUFDLEdBQUUsQ0FBQyxDQUFDO0FBQzFNLFFBQU0sUUFBTSxRQUFRLE9BQUssRUFBQyxNQUFLLE9BQU0sVUFBUyxRQUFPLFNBQVEsVUFBUyxDQUFDLENBQUMsS0FBSSxJQUFHLENBQUMsTUFBSyxPQUFPLENBQUM7QUFBRyxTQUFPLG9DQUFDLFlBQVksVUFBWixFQUFxQixTQUFlLFFBQVM7QUFBdUI7QUFDdEssYUFBTSxVQUFRLE1BQUksV0FBVyxXQUFXOyIsIm5hbWVzIjpbXX0=
