using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public enum ButtonType
{
    MainMenu,
    NewGame,
    OptionsMenu,
    CheckersMenu,
    Game,
    CheckersChallenges,
    ReturnToMainMenu,
    Exit
}

public class ButtonController : MonoBehaviour
{
    public ButtonType buttonType;

    CanvasManager canvasManager;
    Button menuButton;

    private void Start()
    {
        menuButton = GetComponent<Button>();
        menuButton.onClick.AddListener(OnButtonClicked);
        canvasManager = CanvasManager.GetInstance();
    }

    void OnButtonClicked()
    {
        switch (buttonType)
        {
            default:
                canvasManager.SwitchCanvas(CanvasType.MainMenu);
                break;
            case ButtonType.CheckersMenu:
                canvasManager.SwitchCanvas(CanvasType.CheckersGameMenu);
                break;
            case ButtonType.NewGame:
                canvasManager.SwitchCanvas(CanvasType.NewGameMenu);
                break;
            case ButtonType.OptionsMenu:
                //canvasManager.SwitchCanvas(CanvasType.OptionsMenu);
                break;
            case ButtonType.Game:
                canvasManager.SwitchCanvas(CanvasType.Game);
                break;
            case ButtonType.CheckersChallenges:
                canvasManager.SwitchCanvas(CanvasType.CheckersChallenges);
                break;
            case ButtonType.Exit:
                Application.Quit();
                break;                
        }
    }
}
