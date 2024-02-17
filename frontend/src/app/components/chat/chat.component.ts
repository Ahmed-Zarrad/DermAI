import {Component, OnDestroy, OnInit} from '@angular/core';
import {Chat} from "../../models/chat.model";
import {Notification} from "../../models/notification.model";
import {ChatbotService} from "../../services/chatbot/chatbot.service";
import {NotificationService} from "../../services/notification/notification.service";
import {ActivatedRoute, Router} from '@angular/router';
import {Message} from "../../models/message.model";
import {User} from "../../models/user.model";
import {UserService} from "../../services/user/user.service";
import {SkinResultsService} from "../../services/skin-results/skin-results.service";
import {SkinResults} from "../../models/skin-results.model";
import {interval, Subscription} from "rxjs";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  private readonly refreshInterval = 100;
  isActionMenuVisible: boolean = false;
  isDoctorsVisible : boolean =false;
  isPatientVisible : boolean =false;
  isDermAIVisible : boolean= false;
  showData : boolean= false;
  isChatActive : boolean= false;
  userActivePhoto: any;
  userActiveFirstName: any;
  userActiveLastName: any;
  userActiveStatus: any;
  userId: any;
  ListChats: Chat[]= [];
  ListUsersId: any= [];
  ListSpecialities: any= [];
  ListMessages: Message[]= [];
  ListDoctors: User[]= [];
  ListPatients: User[]= [];
  ListResults: SkinResults[]= [];
  u: any = {};
  c: any = {};
  m: any = {};
  sr: any = {};
  s: any = {};
  msg:any;
  messagesCount:number=0;
  initialRowHeight = 20;
  resp: any = null;
  userInput: any;
  loading = false;
  idChat:any;
  result: any;
  nResults: any;
  err: any
  user: any = localStorage.getItem('AuthUsername');
  role: any = localStorage.getItem('AuthAuthorities');
  currentUserString = localStorage.getItem('CurrentUser');
  currentUser = this.currentUserString ? JSON.parse(this.currentUserString) : null;
  constructor(private route: ActivatedRoute, private chatbotService: ChatbotService, private notificationService: NotificationService, private userService: UserService, private skinResultsService: SkinResultsService, private router: Router) { }
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ShowActionMenu() {
    this.isActionMenuVisible = !this.isActionMenuVisible;
  }
  ShowDoctorsContacts() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.isChatActive = false;
    this.ListChats = [];
    this.ListMessages = [];
    this.ListResults = [];
    this.ListSpecialities = [];
    this.isDoctorsVisible = true;
    this.isPatientVisible = false;
    this.isDermAIVisible = false;
    this.idChat=null;
    this.userService.getByRoleUser('doctor').subscribe(data => {
        this.ListDoctors = data.filter((doctor: { id: string })=> doctor.id !== this.currentUser.id);
        let specialtiesSet = new Set();
        this.ListDoctors.forEach(doctor => {
          specialtiesSet.add(doctor.speciality);
        });
        this.ListSpecialities = Array.from(specialtiesSet);
        this.chatbotService.getAllChats('UserChat').subscribe(data => {
            this.ListChats = data;
            this.ListChats.forEach(chat => {
                chat.users.forEach(id => {
              this.ListUsersId.push(id);
            });
            });
          },
          error => {
            console.log(error);
          });
      },
      error => {
        console.log(error);
      });
  }
  ShowPatientsContacts() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.isChatActive = false;
    this.ListChats = [];
    this.ListMessages = [];
    this.ListResults = [];
    this.ListSpecialities = [];
    this.isPatientVisible = true;
    this.isDoctorsVisible = false;
    this.isDermAIVisible = false;
    this.idChat=null;
    this.userService.getByRoleUser('patient').subscribe(data => {
        this.ListPatients = data;
        this.chatbotService.getAllChats('UserChat').subscribe(data => {
            this.ListChats = data;
            this.ListChats.forEach(chat => {
              chat.users.forEach(id => {
                this.ListUsersId.push(id);
              });
            });
          },
          error => {
            console.log(error);
          });
      },
      error => {
        console.log(error);
      });
  }
  ShowDermAI() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.isChatActive = false;
    this.ListChats = [];
    this.ListMessages = [];
    this.ListResults = [];
    this.ListSpecialities = [];
    this.isDermAIVisible = true;
    this.isPatientVisible = false;
    this.isDoctorsVisible = false;
    this.idChat=null;
    const type = "ChatbotChat";
    this.chatbotService.getAllChats(type).subscribe(data => {
        this.ListChats = data;
      },

      error => {
        console.log(error);
      });
  }
  createChatbotChat() {
    this.chatbotService.crateChatbotChat().subscribe(
      data => {
        this.ListChats.unshift(data);
      },
      error => {
        console.log(error);
        this.msg = 'error occured !';
      }
    );
  }
  createUserChat(userId:any) {
    this.chatbotService.crateUserChat(userId).subscribe(
      data => {
        this.ListChats.unshift(data);
      },
      error => {
        console.log(error);
        this.msg = 'error occured !';
      }
    );
  }
  userc(id:any):String{
    this.userId = id;
    this.ListChats.forEach(chat => {
      chat.users.forEach(uid => {
        if (uid==id){
          this.c.id=chat.id;
        }
      });
    });
    return this.c.id;
  }
  userap(photo:any):String{
    return this.userActivePhoto = photo;
  }
  useraf(firstName:any):String{
    return this.userActiveFirstName = firstName;
  }
  useral(lastName:any):String{
    return this.userActiveLastName = lastName;
  }
  useras(status:any):String{
    return this.userActiveStatus = status;
  }
  deleteChat(idChat: any, type: any) {
    this.chatbotService.deleteChat(idChat).subscribe(
      data => {
        this.msg = 'Chat deleted succefully !';
        this.resp = data;
      },
      error =>
        console.log(error)
    );
    this.chatbotService.getAllChats(type).subscribe(data => {
        this.ListChats = data;
      },

      error => {
        console.log(error);
      });
  }
  activateUserChat(idChat: any){
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.idChat = idChat;
    this.isChatActive= true;
    this.subscription = interval(this.refreshInterval).subscribe(() => {
    this.chatbotService.getAllMessages(idChat).subscribe(data => {
        this.ListMessages = data;
        this.messagesCount = this.ListMessages.length
      },

      error => {
        console.log(error);
      });
    });
  }
  activateChatbotChat(idChat: any){
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.idChat = idChat;
    this.isChatActive= true;
    this.subscription = interval(this.refreshInterval).subscribe(() => {
    this.chatbotService.getAllMessages(idChat).subscribe(data => {
        this.ListMessages = data;
        this.messagesCount = this.ListMessages.length
      },

      error => {
        console.log(error);
      });
    this.skinResultsService.getAllResults(this.idChat).subscribe(
      data =>{
        this.ListResults = data;
        this.nResults = this.ListResults.length;
      },
      error => {
        console.log(error);
        this.msg = 'error';
      });
    });
  }
  sendMessageToUser(): void {
    const message = this.userInput.trim();
    if (message.length === 0) return;
    this.loading = true;
    this.userInput = '';
    this.chatbotService.sendMessageToUser(message, this.idChat).subscribe(
      data => {
        this.ListMessages.push(data);
        this.loading = false;
        this.notificationService.addNotification(this.userId, 'New message from '+this.currentUser.role+' '+' '+this.currentUser.firstName+' '+this.currentUser.lastName, this.currentUser.firstName+':'+' '+message, this.currentUser.photo).subscribe(
          data => {
          },
          error => {
            console.log(error);
            this.msg = 'error occured !';
          }
        );

      },
      error => {
        console.log(error);
        this.msg = 'error';
      }
    );
  }
  sendMessageToChatbot(): void {
    const message = this.userInput.trim();
    if (message.length === 0) return;
    this.loading = true;
    this.userInput = "";
    this.chatbotService.chatbot(message, 'user', this.idChat).subscribe(
      data => {
        this.ListMessages.push(data.User);
        this.ListMessages.push(data.DermAI);
        this.loading = false;
      },
      error => {
        console.log(error);
        this.msg = 'error';
      }
    );
  }
  sendBotMessage(message:any): void {
    if (message.length === 0) return;
    this.loading = true;
    this.chatbotService.chatbot(message, 'assistant', this.idChat).subscribe(
      data => {
        this.ListMessages.push(data.User);
        this.ListMessages.push(data.DermAI);
        this.loading = false;
      },
      error => {
        console.log(error);
        this.msg = 'error';
      }
    );
  }
  autoResize(event: Event): void {
    const element = event.target as HTMLTextAreaElement;
    element.style.height = `${this.initialRowHeight}px`;
    element.style.height = `${element.scrollHeight}px`;
  }
  logout() {
    localStorage.clear();
    this.router.navigate(["/login"]);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
  handleImageUpload(event: any):void {
    this.loading = true;
    if (event.target.files.length > 0) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

      if (!allowedTypes.includes(event.target.files[0].type)) {
        this.loading = false;
        this.msg= 'Invalid image type (only png, jpg, jpeg are allowed).';
      }

      else if (event.target.files[0].size > 3000000) {
        this.loading = false;
        this.msg = 'Image size must be less than 1MB';
      }

      const skinImage: File = event.target.files[0];
      this.skinResultsService.uploadSkinImage(skinImage, this.idChat).subscribe(
        data => {
          this.result = data;
          this.ListResults.push(data);
          this.nResults = this.ListResults.length;

          this.chatbotService.chatbot(this.result.image,'user', this.idChat).subscribe(
            data => {
              console.log(data);
              this.ListMessages.push(data.User);
              this.ListMessages.push(data.DermAI);
            },
            error => {
              console.log(error);
              this.msg = 'error';
            });
          this.chatbotService.chatbot("the result of processing the user " +
            "skin image is: Skin type: "+this.result.skinType+", Probability: "+this.result.probability+"% " +
            "ask the user 5 yes or no question to verify if he really have this skin disease or no " +
            "and Do not ask all the questions at once, send each question separately and after the user " +
            "reply with yes or no ask the user the next question until the user answer all the questions after " +
            "the user answer all the questions Tell him whether his answers indicate symptoms of the skin disease " +
            "or not and then suggest to him to chat with one of the application dermatologists Doctor Achref Zarrad "
            , 'system', this.idChat).subscribe(
            data => {
              this.ListMessages.push(data.DermAI);

            },
            error => {
              console.log(error);
              this.msg = 'error';
            }
          );
          this.loading = false;
        },
        error => {
          console.log(error);
          this.err= error;
          this.loading = false;
          if (this.err.status===401) {
            this.msg = 'Token expired. You must login to continue';
            setTimeout(() => {
              this.logout();}, 4000);
          }
          else if (this.err.status === 500) {

            this.msg = 'Failed to connect to the server.';
          }

          else {
            this.msg = 'Invalid image.';
          }
        });
    }
  }
}
