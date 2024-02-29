namespace SignalrApp.Hubs
{
  using Microsoft.AspNetCore.SignalR;
  using System.Threading.Tasks;
  public class ItemHub : Hub
  {
    public override Task OnConnectedAsync()
    {
   
      var userId = Context.GetHttpContext().Request.Query["userId"];
      Console.WriteLine("A Client Connected: " + Context.ConnectionId + " with userId: " + userId);
      Groups.AddToGroupAsync(Context.ConnectionId, userId);
      return base.OnConnectedAsync();
       
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
      var userId = Context.GetHttpContext().Request.Query["userId"];
      Console.WriteLine("A Client Disconnected: " + Context.ConnectionId + " with userId: " + userId);
      Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
      return base.OnDisconnectedAsync(exception);
    }
  }
}