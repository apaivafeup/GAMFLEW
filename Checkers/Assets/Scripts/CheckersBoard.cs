using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CheckersBoard : MonoBehaviour
{
    public Piece[,] pieces = new Piece[8, 8];
    public GameObject whitePiecePrefab;
    public GameObject blackPiecePrefab;

    private Vector3 boardOffset = new Vector3(-4.0f, 0, -4.0f);
    private Vector3 pieceOffset = new Vector3(0.5f, 0, 0.5f);

    public bool isWhite;
    private bool isWhiteTurn;
    private bool hasKilled;

    private Piece selectedPiece;
    private List<Piece> forcedPieces;

    private Vector2 mouseOver;
    private Vector2 startDrag;
    private Vector2 endDrag;

    private void Start()
    {
        isWhiteTurn = true;
        forcedPieces = new List<Piece>();
        GenerateBoard();
    }

    private void Update()
    {
        UpdateMouseOver();

        Debug.Log(mouseOver);
        // If it is my turn.
        {
            int x = (int)mouseOver.x;
            int y = (int)mouseOver.y;

            if (selectedPiece != null)
            {
                UpdatePieceDrag(selectedPiece);
            }

            if (Input.GetMouseButtonDown(0))
            {
                SelectPiece(x, y);
            }

            if (Input.GetMouseButtonUp(0)) {
                TryMove((int) startDrag.x, (int) startDrag.y, x, y);
            }
        }
    }
    private void UpdateMouseOver()
    {
        if (!Camera.main)
        {
            Debug.Log("Unable to find main camera.");
            return;
        }

        RaycastHit hit;
        if (Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out hit, 25.0f, LayerMask.GetMask("Board")))
        {
            mouseOver.x = (int) (hit.point.x - boardOffset.x);
            mouseOver.y = (int) (hit.point.z - boardOffset.z);
        } else
        {
            mouseOver.x = -1;
            mouseOver.y = -1;
        }
    }

    private void UpdatePieceDrag(Piece p)
    {
        if (!Camera.main)
        {
            Debug.Log("Unable to find main camera.");
            return;
        }

        RaycastHit hit;
        if (Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out hit, 25.0f, LayerMask.GetMask("Board")))
        {
            p.transform.position = hit.point + Vector3.up;
        }
    }
    private void SelectPiece(int x, int y)
    {
        // Check for out of bounds.
        if (x < 0 || x >= 8 || y < 0 || y >= 8)
            return;

        Piece p = pieces[x, y];
        if (p != null && p.isWhite == isWhite)
        {
            if (forcedPieces.Count == 0)
            {
                selectedPiece = p;
                startDrag = mouseOver;
            } else
            {
                // Look for the piece under our forced pieces list.
                if (forcedPieces.Find(fp => fp == p) == null)
                {
                    return;
                }

                selectedPiece = p;
                startDrag = mouseOver;

            }

            
        }

    }

    private void TryMove(int startX, int startY, int endX, int endY)
    {
        forcedPieces = ScanForPossibleMove();

        startDrag = new Vector2(startX, startY);
        endDrag = new Vector2(endX, endY);
        selectedPiece = pieces[startX, startY];

        MovePiece(selectedPiece, endX, endY);

        // Check for out of bounds.
        if (endX < 0 || endX > 7 || endY < 0 || endY > 7)
        {
            if (selectedPiece != null)
                MovePiece(selectedPiece, startX, startY);
            
            startDrag = Vector2.zero;
            selectedPiece = null;
            return;
        }

        // If there is a selected Piece.
        if (selectedPiece != null)
        {
            // If no move is registered.
            if (endDrag == startDrag)
            {
                MovePiece(selectedPiece, startX, startY);
                startDrag = Vector2.zero;
                selectedPiece = null;
                return;
            }

            // Check if it's a valid move.
            if (selectedPiece.ValidMove(pieces, startX, startY, endX, endY))
            {
                // Did we kill anything - is this a jump.
                
                if (Mathf.Abs(startX - endX) == 2)
                {
                    Piece p = pieces[(startX + endX) / 2, (startY + endY) / 2];
                    
                    if (p != null)
                    {
                        pieces[(startX + endX) / 2, (startY + endY) / 2] = null;
                        Destroy(p.gameObject);
                        hasKilled = true;
                    }  
                }

                // Are we obligated to kill?
                if (forcedPieces.Count != 0 && !hasKilled)
                {
                    MovePiece(selectedPiece, startX, startY);
                    startDrag = Vector2.zero;
                    selectedPiece = null;
                    return;
                }

                pieces[endX, endY] = selectedPiece;
                pieces[startX, startY] = null;
                MovePiece(selectedPiece, endX, endY);

                EndTurn();
            } else
            {
                MovePiece(selectedPiece, startX, startY);
                startDrag = Vector2.zero;
                selectedPiece = null;
                return;
            }
        }
    }

    private void EndTurn()
    {
        selectedPiece = null;
        startDrag = Vector2.zero;
        isWhiteTurn = !isWhiteTurn;
        isWhite = !isWhite;
        hasKilled = false;
        CheckVictory();
    }

    private void CheckVictory()
    {
        // Ending the game.
    }

    private List<Piece> ScanForPossibleMove()
    {
        forcedPieces = new List<Piece>();

        // Check all the pieces.
        for (int i = 0; i < 8; i++)
        {
            for (int j = 0; j < 8; j++)
            {
                if (pieces[i,j] != null && pieces[i,j].isWhite == isWhiteTurn)
                {
                    if (pieces[i,j].IsForcedToMove(pieces, i, j))
                    {
                        forcedPieces.Add(pieces[i, j]);
                    }
                }
            }
        }

        return forcedPieces;
    }
    private void GenerateBoard()
    {
        // Generate white team - first 3 rows.
        for (int y = 0; y < 3; y++)
        {
            for (int x = 0; x < 8; x += 2)
            {
                GeneratePiece((y % 2 == 0 ? x : x + 1), y);
            }
        }

        // Generate black team - first 3 rows.
        for (int y = 7; y > 4; y--)
        {
            for (int x = 0; x < 8; x += 2)
            {
                GeneratePiece((y % 2 == 0 ? x : x + 1), y);
            }
        }

    }
    private void GeneratePiece(int x, int y)
    {
        GameObject go = Instantiate(y < 4 ? whitePiecePrefab : blackPiecePrefab) as GameObject;
        go.transform.SetParent(transform);
        Piece p = go.GetComponent<Piece>();
        pieces[x, y] = p;
        MovePiece(p, x, y);
    }
    private void MovePiece(Piece p, int x, int y)
    {
        p.transform.position = (Vector3.right * x) + (Vector3.forward * y) + boardOffset + pieceOffset;
    }
}
