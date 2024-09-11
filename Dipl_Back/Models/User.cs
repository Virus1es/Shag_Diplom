using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Dipl_Back.Models;

public class User : IdentityUser
{
    [Required]
    public string Password { get; set; } = null!;
}
