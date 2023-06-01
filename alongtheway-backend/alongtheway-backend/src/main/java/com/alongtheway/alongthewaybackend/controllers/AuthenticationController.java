package com.alongtheway.alongthewaybackend.controllers;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.alongtheway.alongthewaybackend.models.User;
import com.alongtheway.alongthewaybackend.models.data.UserRepository;
import com.alongtheway.alongthewaybackend.models.dto.LoginForm;
import com.alongtheway.alongthewaybackend.models.dto.SignupForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.util.Optional;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/signup")
@RestController
@Controller
public class AuthenticationController {

    @Autowired
    UserRepository userRepository;

    private static final String userSessionKey = "user";

    public User getUserFromSession(HttpSession session) {
        String userId = (String) session.getAttribute(userSessionKey);
        if (userId == null) {
            return null;
        }

        Optional<User> user = userRepository.findById(userId);

        if (user.isEmpty()) {
            return null;
        }

        return user.get();
    }

    private static void setUserInSession(HttpSession session, User user) {
        session.setAttribute(userSessionKey, user.getId());
    }

    @GetMapping("/signup")
    public String displayRegistrationForm(Model model) {
        model.addAttribute(new SignupForm());
        model.addAttribute("title", "Sign Up");
        return "signup";
    }

        @PostMapping
        public ResponseEntity<?> processSignupForm(@ModelAttribute @Valid SignupForm signupForm, Errors errors, HttpServletRequest request){

        if (errors.hasErrors()) {
            //return the validation errors as a json response
            return ResponseEntity.badRequest().body(errors.getAllErrors());
        }


        //rejects username if it matches an existing username
        User existingUser = userRepository.findByUsername(signupForm.getUsername());
        if (existingUser != null) {
            //return error as Json
            return ResponseEntity.status(HttpStatus.CONFLICT).body("A user with that username already exists");
        }

        //rejects passwords if both fields do not match
        String password = signupForm.getPassword();
        String verifyPassword = signupForm.getVerifyPassword();
        if (!password.equals(verifyPassword)) {
            //return as json response error
            return ResponseEntity.badRequest().body("Passwords  do not match");
        }

        //assigns new user
        User newUser = new User(signupForm.getUsername(), signupForm.getPassword());
        userRepository.save(newUser);
        setUserInSession(request.getSession(), newUser);


        return ResponseEntity.ok("sign-up successful");
    }

    @GetMapping("/login")
    public String displayLoginForm(Model model) {
        model.addAttribute(new LoginForm());
        model.addAttribute("title", "Log In");
        return "login";
    }

    @PostMapping("/login")
    public String processLoginForm(@ModelAttribute @Valid LoginForm loginForm,
                                   Errors errors, HttpServletRequest request,
                                   Model model) {
        //rejects validation errors
        if (errors.hasErrors()) {
            model.addAttribute("title", "Log In");
            return "login";
        }


        //rejects username if it matches an existing username
        User theUser = userRepository.findByUsername(loginForm.getUsername());

        if (theUser == null) {
            errors.rejectValue("username", "user.invalid", "The given username does not exist");
            model.addAttribute("title", "Log In");
            return "login";
        }

        //rejects password if it does not match existing hash
        String password = loginForm.getPassword();
        if (!theUser.isMatchingPassword(password)) {
            errors.rejectValue("password", "password.invalid", "Invalid password");
            model.addAttribute("title", "Log In");
            return "login";
        }

        setUserInSession(request.getSession(), theUser);
        return "redirect:/login";
    }

    @GetMapping("/logout")
    public String logout(HttpServletRequest request){
        request.getSession().invalidate();
        return "redirect:/login";
    }

}
