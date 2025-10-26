import com.proje.security.service.JwtUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class JWTAuthTokenFilterTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtils jwtUtils;

    @Test
    void generate_token_and_access_secure_api() throws Exception {
        String token = jwtUtils.generateTokenFromUsername("testuser");

        mockMvc.perform(get("/api/user/loginJWT")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());




    }


}
