namespace SignalrApp.Hubs
{
  using Microsoft.AspNetCore.SignalR;
  using System.Threading.Tasks;
  public class ItemHub : Hub
  {
    public override Task OnConnectedAsync()
    {
      Console.WriteLine("A Client Connected: " + Context.ConnectionId);
      return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
      Console.WriteLine("A client disconnected: " + Context.ConnectionId);
      return base.OnDisconnectedAsync(exception);
    }
  }
}