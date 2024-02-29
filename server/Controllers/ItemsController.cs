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
    public IEnumerable<Item> Get()
    {
        return _context.Items.ToList();
    }

    [HttpGet("{id}")]
    public Item Get(int id)
    {
        return _context.Items.Find(id);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Item Item)
    {
        _context.Items.Add(Item);
        _context.SaveChanges();
        await _hubContext.Clients.All.SendAsync("ItemCreated", Item);
        return Ok(Item);
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
            return Ok(Item);
        }
        return NotFound("Item not found");
    }




[HttpPost("{id}/order")]
public async Task<IActionResult> PlaceOrder(int id, [FromBody] PlaceOrderRequest request)
{
    var username = request.Username;
    if (string.IsNullOrEmpty(username))
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
        id, username
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
