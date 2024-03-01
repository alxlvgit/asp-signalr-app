namespace SignalrApp.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalrApp.Hubs;
using SignalrApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


[Route("api/[controller]")]
[ApiController]
public class ItemsController  : ControllerBase
{
    private readonly DatabaseContext _context;
    private readonly IHubContext<ItemHub> _hubContext;

    public ItemsController (DatabaseContext context, IHubContext<ItemHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpGet]
    public IEnumerable<ItemWithUser> Get()
    {
  
        var items = _context.Items.Join(
            _context.Users,
            item => item.UserId,
            user => user.Id,
            (item, user) => new ItemWithUser
            {
                Id = item.Id,
                Name = item.Name,
                Description = item.Description,
                Price = item.Price,
                User = user
            }
        );
        return items;
    }

    [HttpGet("{id}")]
    public ItemWithUser Get(int id)
    {
        var item = _context.Items.Find(id);
        var user = _context.Users.Find(item.UserId);
        return new ItemWithUser
        {
            Id = item.Id,
            Name = item.Name,
            Description = item.Description,
            Price = item.Price,
            User = user
        };
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Item Item)
    {
        _context.Items.Add(Item);
        _context.SaveChanges();
        var user = _context.Users.Find(Item.UserId);
        await _hubContext.Clients.All.SendAsync("ItemCreated", new ItemWithUser
        {
            Id = Item.Id,
            Name = Item.Name,
            Description = Item.Description,
            Price = Item.Price,
            User = user
        });
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var Item = _context.Items.Find(id);
        if (Item != null)
        {
            _context.Items.Remove(Item);
            _context.SaveChanges();
            await _hubContext.Clients.All.SendAsync("ItemDeleted", Item.Id);
            return Ok();
        }
        return NotFound("Item not found");
    }




[HttpPost("{id}/order")]
public async Task<IActionResult> PlaceOrder(int id, [FromBody] PlaceOrderRequest request)
{
    var buyer = request.Username;
    if (string.IsNullOrEmpty(buyer))
    {
        return BadRequest("Username is required");
    }
    var item = _context.Items.Find(id);
    if (item == null)
    {
        return NotFound("Item not found");
    }
    
    // Notify the user who created the item
    await _hubContext.Clients.Group(item.UserId.ToString()).SendAsync("OrderPlaced", new
    {
        id, buyer
    });
    return Ok(
        new
        {
            Message = "Order has been placed",
            ItemId = id
        }
    );
}

}

   public class PlaceOrderRequest
{
    public string Username { get; set; }
}


public class ItemWithUser{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public User User { get; set; }
}
