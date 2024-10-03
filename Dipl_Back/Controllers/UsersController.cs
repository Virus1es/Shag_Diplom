using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Authentication;

namespace Dipl_Back.Controllers;

[Route("[controller]/{action}")]
[ApiController]
public class UsersController : Controller
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;


    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly IUserStore<IdentityUser> _userStore;
    private readonly IUserEmailStore<IdentityUser> _emailStore;
    private readonly ILogger<UsersController> _logger;
    private readonly IEmailSender _emailSender;


    // создаем две роли
    private readonly IdentityRole role1 = new IdentityRole { Name = "admin" };
    private readonly IdentityRole role2 = new IdentityRole { Name = "user" };

    public UsersController(UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IUserStore<IdentityUser> userStore,
            SignInManager<IdentityUser> signInManager,
            ILogger<UsersController> logger,
            IEmailSender emailSender)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _userStore = userStore;
        _emailStore = GetEmailStore();
        _signInManager = signInManager;
        _logger = logger;
        _emailSender = emailSender;
    }

    public IList<AuthenticationScheme> ExternalLogins { get; set; }

    private IUserEmailStore<IdentityUser> GetEmailStore()
    {
        if (!_userManager.SupportsUserEmail)
        {
            throw new NotSupportedException("The default UI requires a user store with email support.");
        }
        return (IUserEmailStore<IdentityUser>)_userStore;
    }

    [HttpPost]
    public async Task<ActionResult<IdentityUser>> PostUser(IdentityUser user)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _userManager.CreateAsync(
            new IdentityUser() { UserName = user.UserName, Email = user.Email },
            user.PasswordHash
        );

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        user.PasswordHash = null!;
        return Created("", user);
    }

    [HttpGet]
    public async Task<ActionResult<IdentityUser>> GetUser([FromForm] string username = "commonUser")
    {
        IdentityUser user = await _userManager.FindByNameAsync(username);

        if (user == null)
        {
            return NotFound();
        }

        return new IdentityUser
        {
            UserName = user.UserName,
            Email = user.Email
        };
    }

    [HttpPost]
    public async Task<string> RegisterAsync([FromForm] string username, [FromForm] string email, [FromForm] string password)
    {
        StringBuilder sb = new("Errors: ");

        ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();
        if (ModelState.IsValid)
        {
            var user = CreateUser();

            await _userStore.SetUserNameAsync(user, username, CancellationToken.None);
            await _emailStore.SetEmailAsync(user, email, CancellationToken.None);
            var result = await _userManager.CreateAsync(user, password);

            if (result.Succeeded)
            {
                _logger.LogInformation("Пользователь успешно создан.");

                var userId = await _userManager.GetUserIdAsync(user);
                var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

                await _signInManager.SignInAsync(user, isPersistent: false);

                await _userManager.AddToRoleAsync(user, "user");
                return $"Аккаунт успешно создан {username}; {email}; {password}";
            }
            foreach (var error in result.Errors)
            {
                sb.AppendLine(error.Description);
            }
        }

        // If we got this far, something failed, redisplay form
        return sb.ToString();
    }

    private IdentityUser CreateUser()
    {
        try
        {
            return Activator.CreateInstance<IdentityUser>();
        }
        catch
        {
            throw new InvalidOperationException($"Can't create an instance of '{nameof(IdentityUser)}'. " +
                $"Ensure that '{nameof(IdentityUser)}' is not an abstract class and has a parameterless constructor, or alternatively " +
                $"override the register page in /Areas/Identity/Pages/Account/Register.cshtml");
        }
    }

    // проверить вошёл ли пользователь уже в аккаунт
    [HttpGet]
    public async Task<string> CheckIn()
    {
        var user = await _signInManager.GetExternalLoginInfoAsync();
        return $"Хранится пользователь: {user}";
    }


    [HttpPost]
    public async Task<string> Logout()
    {
        await _signInManager.SignOutAsync();
        _logger.LogInformation("User logged out.");
        return "Выход успешен";
    }

    [HttpPost]
    public async Task<string> Login([FromForm] string username, [FromForm] string password, [FromForm] bool remember = false)
    {
        ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();

        StringBuilder sb = new("Errors: ");

        if (ModelState.IsValid)
        {
            // This doesn't count login failures towards account lockout
            // To enable password failures to trigger account lockout, set lockoutOnFailure: true
            var result = await _signInManager.PasswordSignInAsync(username, password, remember, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                var user = await _userManager.FindByNameAsync(username);

                _logger.LogInformation("User logged in.");

                var res = await _userManager.GetRolesAsync(user);
                return res.First();
            }
            if (result.IsLockedOut)
            {
                _logger.LogWarning("User account locked out.");
                return "Пользователь заблокирован";
            }
            else
            {
                sb.AppendLine("Не верно указан логин или пароль");
            }
        }

        // If we got this far, something failed, redisplay form
        return sb.ToString();
    }

    public class UserWithRoles
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public IList<string> Roles { get; set; }
    }

    // получить список пользователей
    public async Task<JsonResult> GetUsers()
    {
        var users = _userManager.Users.ToList();
        var userWithRolesList = new List<UserWithRoles>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userWithRolesList.Add(new UserWithRoles
            {
                UserId = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Roles = roles.ToList()
            });
        }

        return new(userWithRolesList);
    }

    // изменить роль пользователю
    [HttpPost]
    public async Task<IActionResult> ChangeUserRoleAsync([FromForm] string userId, [FromForm] string newRole)
    {
        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(newRole))
        {
            return BadRequest("Не верный запрос.");
        }

        // Находим пользователя по его ID
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound("Пользователь не найден."); // Пользователь не найден
        }

        // Получаем текущие роли пользователя
        var currentRoles = await _userManager.GetRolesAsync(user);

        // Удаляем все текущие роли
        var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
        if (!removeResult.Succeeded)
        {
            return NotFound("Не удалось убрать предыдущую роль."); // Ошибка при удалении ролей
        }

        // Добавляем новую роль
        var addResult = await _userManager.AddToRoleAsync(user, newRole);

        // Возвращаем результат добавления роли
        if (addResult.Succeeded)
        {
            return Ok("Роль пользователя успешно изменена.");
        }
        else
        {
            return NotFound("Ошибка при изменении роли.");
        }
    }
}
