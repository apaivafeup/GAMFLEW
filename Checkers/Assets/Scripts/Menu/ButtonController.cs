using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public enum ButtonType
{
    MainMenu,
    NewGame,
    OptionsMenu,
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
            case ButtonType.NewGame:
                canvasManager.SwitchCanvas(CanvasType.NewGameMenu);
                break;
            case ButtonType.OptionsMenu:
                //canvasManager.SwitchCanvas(CanvasType.OptionsMenu);
                break;
            case ButtonType.Exit:
                Application.Quit();
                break;                
        }
    }
}
