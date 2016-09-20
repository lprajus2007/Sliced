import com.models.Twitter;
import org.json.JSONObject;

@RestController
class ThisWillActuallyRun {

    @RequestMapping("/")
    JSONObject home() {
      return Twitter.startTwitterAuthentication();
    }

}